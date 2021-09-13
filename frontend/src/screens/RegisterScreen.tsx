import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import {
	useGetGoogleLoginURLQuery,
	useRegisterUserMutation,
} from '../api/authApi'
import FormContainer from '../components/FormContainer'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setCredentials } from '../slices/authSlice'
import { RegisterRequest } from '../types'
import Meta from '../components/Meta'
import { GoogleLoginButton } from 'react-social-login-buttons'

const RegisterScreen = () => {
	const dispatch = useAppDispatch()
	const history = useHistory()
	const location = useLocation()
	const [error, setError] = useState('')

	const userInfo = useAppSelector(state => state.authReducer.user)

	const redirect = location.search ? location.search.split('=')[1] : '/'

	useEffect(() => {
		if (userInfo) {
			history.push(redirect)
		}
	}, [history, redirect, userInfo])

	const [formState, setFormState] = useState<RegisterRequest>({
		name: '',
		email: '',
		password: '',
		strategy: 'local',
	})

	const { data: googleLogin } = useGetGoogleLoginURLQuery()

	const [register, { isLoading }] = useRegisterUserMutation()

	const handleChange = ({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) =>
		setFormState(prev => ({ ...prev, [name]: value }))

	const submitHandler = async () => {
		try {
			const res = await register(formState).unwrap()
			dispatch(setCredentials(res))
			history.push('/')
		} catch (error: any) {
			if (Array.isArray(error.data.message)) {
				setError(error.data.message.join(' '))
			} else {
				setError(error.data.message)
			}
			setTimeout(() => {
				setError('')
			}, 10000)
		}
	}
	return (
		<>
			<Meta
				title={`Register On My Shop for Portfolio`}
				description={`Registration page`}
			/>
			<FormContainer>
				<h1>Sign Up</h1>
				{error && <Alert variant='danger'>{error}</Alert>}
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
						<Button variant='primary' onClick={submitHandler}>
							Sign Up
						</Button>
					)}
					<Row className='py-3'>
						<Col md={4}>
							Have an Account?{' '}
							<Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
								Login
							</Link>
						</Col>
					</Row>
					<Row>
						<Col md={{ span: 6, offset: 3 }}>
							{googleLogin && (
								<a href={googleLogin.URL}>
									<GoogleLoginButton>Sign up with Google</GoogleLoginButton>
								</a>
							)}
						</Col>
					</Row>
				</Form>
			</FormContainer>
		</>
	)
}

export default RegisterScreen
