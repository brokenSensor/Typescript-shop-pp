import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import {
	useGetOrderByIdQuery,
	useGetPayPalConfigQuery,
	useUpdateOrderToPayedMutation,
} from '../api/orderApi'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useAppSelector } from '../hooks'
import { PayPalButton } from 'react-paypal-button-v2'

const OrderScreen = () => {
	const { id: orderId } = useParams<{
		id: string
	}>()

	const [sdkReady, setSdkReady] = useState(false)

	const history = useHistory()

	const { user } = useAppSelector(state => state.authReducer)

	const {
		data,
		error,
		isLoading,
		refetch: refetchOrder,
	} = useGetOrderByIdQuery(parseInt(orderId))

	if (!user?.isAdmin && data?.user.id !== user?.id) {
		history.push('/')
	}

	const { data: PayPalConfig } = useGetPayPalConfigQuery()

	const [updateToPayed, { isLoading: loadingPay, isSuccess: orderPaySuccess }] =
		useUpdateOrderToPayedMutation()

	useEffect(() => {
		if (!user) {
			history.push('/login')
		}

		const addPayPalScript = () => {
			const script = document.createElement('script')
			script.text = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?client-id=${PayPalConfig?.clientId}`
			script.async = true
			script.onload = () => {
				setSdkReady(true)
			}
			document.body.appendChild(script)
		}

		if (!data || orderPaySuccess) {
			refetchOrder()
		} else if (!data.isPaid) {
			if (!window.paypal) {
				addPayPalScript()
			} else {
				setSdkReady(true)
			}
		}
	}, [
		PayPalConfig?.clientId,
		data,
		history,
		orderPaySuccess,
		refetchOrder,
		user,
	])

	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<h1>Order {data?.id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: {data?.user.name}</strong>
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${data?.user.email}`}>{data?.user.email}</a>
							</p>
							<p>
								<strong>Address: </strong> {data?.shippingAddress.address},{' '}
								{data?.shippingAddress.city}, {data?.shippingAddress.postalCode}
								, {data?.shippingAddress.country}
							</p>
							{data?.isDelivered ? (
								<Message variant='success'>
									Delivered on {data.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'> Not Delivered </Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{data?.paymentMethod}
							</p>
							{data?.isPaid ? (
								<Message variant='success'>Paid on {data.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{data?.orderItems.length === 0 ? (
								<Message>Order is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{data?.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													></Image>
												</Col>
												<Col>
													<Link to={`/product/${item.productId}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${data?.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${data?.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${data?.taxPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${data?.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!data?.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										data && (
											<PayPalButton
												amount={data?.totalPrice}
												onSuccess={async (payPalRes: any) => {
													try {
														console.log(payPalRes)

														await updateToPayed({
															orderId: data?.id,
															paymentResult: {
																status: payPalRes.status,
																update_time: payPalRes.update_time,
																email_address: payPalRes.payer.email_address,
															},
														})
													} catch (error) {
														console.log(error)
													}
												}}
											/>
										)
									)}
								</ListGroup.Item>
							)}
							{user && user.isAdmin && data?.isPaid && !data.isDelivered && (
								<ListGroup.Item className='d-grid gap-2'>
									<Button
										type='button'
										className='btn-block'
										size='lg'
										onClick={() => {
											console.log('asd')
										}}
									>
										Mark As Delivered
									</Button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
