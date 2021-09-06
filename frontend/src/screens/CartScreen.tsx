import React from 'react'
import {
	Alert,
	Button,
	Card,
	Col,
	Form,
	Image,
	ListGroup,
	Row,
} from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import Meta from '../components/Meta'
import { useAppDispatch, useAppSelector } from '../hooks'
import { addToCart, removeFromCartByIndex } from '../slices/cartSlice'

const CartScreen = () => {
	const dispatch = useAppDispatch()
	const history = useHistory()
	const cartItems = useAppSelector(state => state.cartReducer.items)
	const userInfo = useAppSelector(state => state.authReducer.user)

	const checkoutHandler = () => {
		history.push('/login?redirect=shipping')
	}
	return (
		<>
			<Meta
				title={`Shopping Cart | ${cartItems.length}`}
				description={`Users shopping cart`}
			/>
			<Row>
				<Col md={8}>
					<h1>Shopping Cart</h1>
					{cartItems.length === 0 ? (
						<Alert variant='info'>Your cart is empty</Alert>
					) : (
						<ListGroup variant='flush'>
							{cartItems.map((item, index) => (
								<ListGroup.Item key={index}>
									<Row>
										<Col md={2}>
											<Image
												src={item.image}
												fluid
												rounded
												alt={item.name}
											></Image>
										</Col>
										<Col md={3}>
											<Link to={`/product/${item.productId}`}>{item.name}</Link>
										</Col>
										<Col md={2}>${item.price}</Col>
										<Col md={2}>
											<Form.Control
												className='text-dark'
												as='select'
												value={item.qty}
												onChange={e =>
													dispatch(
														addToCart({ ...item, qty: Number(e.target.value) })
													)
												}
											>
												{Array.from(
													{ length: item.countInStock },
													(v, k) => k + 1
												).map(x => (
													<option key={x} value={x}>
														{x}
													</option>
												))}
											</Form.Control>
										</Col>
										<Col md={2}>
											<Button
												type='button'
												variant='light'
												onClick={() => dispatch(removeFromCartByIndex(index))}
											>
												<i className='fas fa-trash'></i>
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h2>
									Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
									) items
								</h2>
								$
								{cartItems
									.reduce((acc, item) => acc + item.qty * item.price, 0)
									.toFixed(2)}
							</ListGroup.Item>
							<ListGroup.Item className='d-grid gap-2'>
								{!userInfo?.isActivated && (
									<Alert variant='warning'>
										Please confirm your email to make a purchase!
									</Alert>
								)}
								<Button
									type='button'
									className='btn-block'
									disabled={cartItems.length === 0 || !userInfo?.isActivated}
									onClick={checkoutHandler}
								>
									Proceed To Checkout
								</Button>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default CartScreen
