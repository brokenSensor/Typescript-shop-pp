import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useCreateOrderMutation } from '../api/orderApi'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clearCart } from '../slices/cartSlice'

const PlaceOrderScreen = () => {
	const dispatch = useAppDispatch()
	const history = useHistory()

	const cart = useAppSelector(state => state.cartReducer)

	const itemsPrice = cart.items
		.reduce((acc, item) => acc + item.price * item.qty, 0)
		.toFixed(2)

	const shippingPrice = Number(itemsPrice) > 100 ? 0 : 100

	const taxPrice = Number(0.15 * Number(itemsPrice)).toFixed(2)

	const totalPrice = (
		Number(itemsPrice) +
		Number(shippingPrice) +
		Number(taxPrice)
	).toFixed(2)

	const [createOrder, { data, isSuccess }] = useCreateOrderMutation()

	useEffect(() => {
		if (isSuccess) {
			dispatch(clearCart())
			history.push(`/order/${data?.id}`)
		}
	}, [data?.id, dispatch, history, isSuccess])

	const placeOrderHandler = async () => {
		try {
			await createOrder({
				orderItems: cart.items,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: Number(itemsPrice),
				shippingPrice: shippingPrice,
				taxPrice: Number(taxPrice),
				totalPrice: Number(totalPrice),
			}).unwrap()
		} catch (error: any) {
			if (Array.isArray(error.data.message)) {
				setErrorMassage(error.data.message.join(' '))
			} else {
				setErrorMassage(error.data.message)
			}
			setTimeout(() => {
				setErrorMassage('')
			}, 10000)
		}
	}

	const [errorMassage, setErrorMassage] = useState('')
	return (
		<>
			<Meta title={`Place Order`} description={`Place order page`} />
			<CheckoutSteps step={4} />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
								{cart.shippingAddress.postalCode},{' '}
								{cart.shippingAddress.country}
							</p>
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{cart.items.length === 0 ? (
								<Message>Your card is empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cart.items.map((item, index) => (
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
									<Col>Items:</Col>
									<Col>${itemsPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Shipping:</Col>
									<Col>${shippingPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Tax:</Col>
									<Col>${taxPrice}</Col>
								</Row>
							</ListGroup.Item>

							<ListGroup.Item>
								<Row>
									<Col>Total:</Col>
									<Col>${totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								{errorMassage && (
									<Message variant='danger'>{errorMassage}</Message>
								)}
							</ListGroup.Item>
							<ListGroup.Item className='d-grid gap-2'>
								<Button
									type='button'
									size='lg'
									disabled={cart.items.length === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default PlaceOrderScreen
