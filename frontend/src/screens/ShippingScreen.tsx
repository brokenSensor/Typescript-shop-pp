import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import FormContainer from '../components/FormContainer'
import Meta from '../components/Meta'
import { useAppDispatch, useAppSelector } from '../hooks'
import { saveShippingAddress } from '../slices/cartSlice'
import { ShippingAddress } from '../types'

const ShippingScreen = () => {
	const dispatch = useAppDispatch()
	const history = useHistory()
	const shippingAddressFromState = useAppSelector(
		state => state.cartReducer.shippingAddress
	)

	const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(
		shippingAddressFromState || {
			address: '',
			city: '',
			postalCode: '',
			country: '',
		}
	)

	const handleChange = ({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) =>
		setShippingAddress(prev => ({ ...prev, [name]: value }))

	const submitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		dispatch(saveShippingAddress(shippingAddress))
		history.push('/payment')
	}

	return (
		<>
			<Meta title={`Shipping Address`} description={`Shipping address page`} />
			<FormContainer>
				<CheckoutSteps step1 step2 />
				<h1>Shipping</h1>
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='address'>
						<Form.Label>Address</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter address'
							name='address'
							value={shippingAddress.address}
							required
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='city'>
						<Form.Label>City</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter city'
							name='city'
							value={shippingAddress.city}
							required
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='postalCode'>
						<Form.Label>Postal Code</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter postal code'
							name='postalCode'
							value={shippingAddress.postalCode}
							required
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='country'>
						<Form.Label>Country</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter country'
							name='country'
							value={shippingAddress.country}
							required
							onChange={handleChange}
						></Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Continue
					</Button>
				</Form>
			</FormContainer>
		</>
	)
}

export default ShippingScreen
