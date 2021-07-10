import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useLoginUserMutation } from '../api/authApi'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import { useAppDispatch } from '../hooks'
import { setCredentials } from '../slices/authSlice'
import { LoginRequest } from '../types/auth'

const LoginScreen: React.FC = () => {
	const dispatch = useAppDispatch()
	const { push } = useHistory()
	const [error, setError] = useState('')

	const [formState, setFormState] = useState<LoginRequest>({
		email: '',
		password: '',
	})

	const [login, { isLoading }] = useLoginUserMutation()

	const handleChange = ({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) =>
		setFormState(prev => ({ ...prev, [name]: value }))

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{error && <Message variant='danger'>{error}</Message>}
			<Form>
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
								const res = await login(formState).unwrap()
								dispatch(setCredentials(res))
								push('/')
							} catch (error) {
								if (error.status === 401) {
									setError('Wrong password or email')
								}
							}
						}}
					>
						Sign In
					</Button>
				)}
			</Form>
		</FormContainer>
	)
}

export default LoginScreen
