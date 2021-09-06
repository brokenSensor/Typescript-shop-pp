import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import React, { useEffect, useState } from 'react'
import {
	Alert,
	Button,
	Card,
	Col,
	Image,
	ListGroup,
	Row,
} from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useUpdateOrderToDeliveredMutation } from '../api/adminApi'
import {
	useCreatePayPalOrderMutation,
	useGetOrderByIdQuery,
	useGetPayPalConfigQuery,
	useUpdateOrderToPayedMutation,
} from '../api/orderApi'
import CheckoutSteps from '../components/CheckoutSteps'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { useAppSelector } from '../hooks'

const OrderScreen = () => {
	const { id: orderId } = useParams<{
		id: string
	}>()

	const [ppButtonLoading, setPpButtonLoading] = useState(true)

	const [createPayPalOrder] = useCreatePayPalOrderMutation()
	const [updateToDelivered] = useUpdateOrderToDeliveredMutation()

	const history = useHistory()

	const { user } = useAppSelector(state => state.authReducer)

	const {
		data,
		error,
		isLoading,
		refetch: refetchOrder,
	} = useGetOrderByIdQuery(parseInt(orderId))

	const { data: PayPalConfig } = useGetPayPalConfigQuery()

	const [updateToPayed, { isLoading: loadingPay, isSuccess: orderPaySuccess }] =
		useUpdateOrderToPayedMutation()

	useEffect(() => {
		if (!user?.isAdmin && !isLoading && data?.user.id !== user?.id) {
			history.push('/')
		}
		if (!user) {
			history.push('/login')
		}
		if (orderPaySuccess) {
			refetchOrder()
		}
	}, [data, history, isLoading, orderPaySuccess, refetchOrder, user])

	return (
		<>
			<Meta
				title={`Order ${data?.id} | ${data?.user.name}`}
				description={`Users order page`}
			/>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Alert variant='danger'>{error}</Alert>
			) : (
				<>
					<CheckoutSteps step={data?.isDelivered ? 7 : data?.isPaid ? 6 : 5} />
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
										<a href={`mailto:${data?.user.email}`}>
											{data?.user.email}
										</a>
									</p>
									<p>
										<strong>Address: </strong> {data?.shippingAddress.address},{' '}
										{data?.shippingAddress.city},{' '}
										{data?.shippingAddress.postalCode},{' '}
										{data?.shippingAddress.country}
									</p>
									{data?.isDelivered ? (
										<Alert variant='success'>
											Delivered on {data.deliveredAt}
										</Alert>
									) : (
										<Alert variant='danger'> Not Delivered </Alert>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: </strong>
										{data?.paymentMethod}
									</p>
									{data?.isPaid ? (
										<Alert variant='success'>Paid on {data.paidAt}</Alert>
									) : (
										<Alert variant='danger'>Not Paid</Alert>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Order Items</h2>
									{data?.orderItems.length === 0 ? (
										<Alert variant='info'>Order is empty</Alert>
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
															{item.qty} x ${item.price} = $
															{item.qty * item.price}
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
										<ListGroup.Item id='paypal-button-container'>
											{data && PayPalConfig && (
												<PayPalScriptProvider
													options={{ 'client-id': PayPalConfig.clientId }}
												>
													<PayPalButtons
														disabled={loadingPay || ppButtonLoading}
														onInit={() => {
															setPpButtonLoading(false)
														}}
														createOrder={async () => {
															const PayPalOrderId = createPayPalOrder(
																data.id
															).unwrap()

															return (await PayPalOrderId).orderId
														}}
														onApprove={(ppData, actions) => {
															return actions.order.capture().then(details => {
																updateToPayed({
																	orderId: data.id,
																	paymentResult: {
																		email_address: details.payer.email_address,
																		status: details.status,
																		update_time: details.update_time,
																	},
																})
																refetchOrder()
															})
														}}
													/>
												</PayPalScriptProvider>
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
													updateToDelivered(data.id)
													refetchOrder()
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
			)}
		</>
	)
}

export default OrderScreen
