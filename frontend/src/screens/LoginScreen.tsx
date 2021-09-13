import React, { useState } from 'react'
import { useEffect } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useGetGoogleLoginURLQuery, useLoginUserMutation } from '../api/authApi'
import FormContainer from '../components/FormContainer'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setCredentials } from '../slices/authSlice'
import { LoginRequest, TokensAndUser } from '../types'
import Meta from '../components/Meta'
import { GoogleLoginButton } from 'react-social-login-buttons'

const LoginScreen = () => {
	const dispatch = useAppDispatch()
	const history = useHistory()
	const search = useLocation().search
	const [error, setError] = useState('')

	const userInfo = useAppSelector(state => state.authReducer.user)

	const redirect = new URLSearchParams(search).get('panel') || '/'

	const tokensAndUser = new URLSearchParams(search).get('tokensAndUser')

	const { data: googleLogin } = useGetGoogleLoginURLQuery()

	useEffect(() => {
		if (tokensAndUser !== null) {
			const parsedTokensAndUser: TokensAndUser = JSON.parse(tokensAndUser)
			dispatch(setCredentials(parsedTokensAndUser))
		}
		if (userInfo) {
			history.push(redirect)
		}
	}, [dispatch, history, redirect, tokensAndUser, userInfo])

	const [formState, setFormState] = useState<LoginRequest>({
		email: '',
		password: '',
	})

	const [login, { isLoading }] = useLoginUserMutation()

	const handleChange = ({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement>) =>
		setFormState(prev => ({ ...prev, [name]: value }))

	const submitHandler = async () => {
		try {
			const res = await login(formState).unwrap()
			dispatch(setCredentials(res))
			history.push(redirect)
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
				title={`Login To My Shop for Portfolio`}
				description={`Login page`}
			/>
			<FormContainer>
				<h1>Sign In</h1>
				{error && <Alert variant='danger'>{error}</Alert>}
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
						<>
							<Button variant='primary' onClick={submitHandler}>
								Sign In
							</Button>
						</>
					)}
					<Row className='py-3'>
						<Col md={4}>
							New Customer?{' '}
							<Link
								to={redirect ? `/register?redirect=${redirect}` : '/register'}
							>
								Register
							</Link>
						</Col>
					</Row>
					<Row>
						<Col md={{ span: 6, offset: 3 }}>
							{googleLogin && (
								<a href={googleLogin.URL}>
									<GoogleLoginButton />
								</a>
							)}
						</Col>
					</Row>
				</Form>
			</FormContainer>
		</>
	)
}

export default LoginScreen
