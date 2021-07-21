import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useRegisterUserMutation } from '../api/authApi'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import { useAppDispatch } from '../hooks'
import { setCredentials } from '../slices/authSlice'
import { RegisterRequest } from '../types/auth'

const RegisterScreen = () => {
	const dispatch = useAppDispatch()
	const { push } = useHistory()
	const [error, setError] = useState('')

	const [formState, setFormState] = useState<RegisterRequest>({
		name: '',
		email: '',
		password: '',
	})

	const [register, { isLoading }] = useRegisterUserMutation()

	const handleChange = ({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) =>
		setFormState(prev => ({ ...prev, [name]: value }))

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{error && <Message variant='danger'>{error}</Message>}
			<Form>
				<Form.Group controlId='name'>
					<Form.Label>Full Name</Form.Label>
					<Form.Control
						name='name'
						type='text'
						placeholder='Enter full name'
						onChange={handleChange}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						name='email'
						type='email'
						placeholder='Enter email'
						onChange={handleChange}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						name='password'
						type='password'
						placeholder='Enter password'
						onChange={handleChange}
					></Form.Control>
				</Form.Group>
				{isLoading ? (
					<h3>Loading</h3>
				) : (
					<Button
						variant='primary'
						onClick={async () => {
							try {
								const res = await register(formState).unwrap()
								dispatch(setCredentials(res))
								push('/')
							} catch (error) {
								setError(error.data.message.join(' '))
							}
						}}
					>
						Sign Up
					</Button>
				)}
				<Row className='py-3'>
					<Col>
						Have an Account? <Link to='/login'>Login</Link>
					</Col>
				</Row>
			</Form>
		</FormContainer>
	)
}

export default RegisterScreen