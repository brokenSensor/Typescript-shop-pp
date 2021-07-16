import React from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import Message from '../components/Message'
import { useAppSelector } from '../hooks'

const CartScreen = () => {
	const cartItems = useAppSelector(state => state.cartReducer.items)
	return (
		<Row>
			<Col md={8}>
				<h1>Shoping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>Your cart is empty</Message>
				) : (
					<ListGroup></ListGroup>
				)}
			</Col>
		</Row>
	)
}

export default CartScreen
