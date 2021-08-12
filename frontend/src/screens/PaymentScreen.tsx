import React, { useState } from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import { useAppDispatch, useAppSelector } from '../hooks'
import { savePaymentMethod } from '../slices/cartSlice'
import { PaymentMethod } from '../types'

const PaymentScreen = () => {
	const history = useHistory()
	const dispatch = useAppDispatch()

	const cart = useAppSelector(state => state.cartReducer)
	const { shippingAddress } = cart

	if (!shippingAddress) {
		history.push('/shipping')
	}

	const [paymentMethodState, setPaymentMethodState] =
		useState<PaymentMethod>('PayPal')

	const submitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		dispatch(savePaymentMethod(paymentMethodState))
		history.push('/placeorder')
	}
	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h1>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group>
					<Form.Label as='legend'>Select Method</Form.Label>
					<br />
					<Col>
						<Form.Check
							type='radio'
							label='PayPal or Credit Card'
							id='PayPal'
							name='PaymentMethod'
							value='PayPal'
							checked
							onChange={e => {
								setPaymentMethodState(e.target.value)
							}}
						></Form.Check>
					</Col>
				</Form.Group>
				<br />
				<Button type='submit' variant='primary'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	)
}

export default PaymentScreen
