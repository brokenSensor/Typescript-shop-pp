import React, { useState } from 'react'
import { useEffect } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import {
	useGetGoogleClientIdQuery,
	useGoogleAuthMutation,
	useLoginUserMutation,
} from '../api/authApi'
import FormContainer from '../components/FormContainer'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setCredentials } from '../slices/authSlice'
import { LoginRequest } from '../types'
import {
	GoogleLogin,
	GoogleLoginResponse,
	GoogleLoginResponseOffline,
} from 'react-google-login'
import Meta from '../components/Meta'

const LoginScreen = () => {
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

	const [formState, setFormState] = useState<LoginRequest>({
		email: '',
		password: '',
	})

	const { data } = useGetGoogleClientIdQuery()

	const [login, { isLoading }] = useLoginUserMutation()
	const [google] = useGoogleAuthMutation()

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

	const googleAuthSuccessHandler = async (
		response: GoogleLoginResponse | GoogleLoginResponseOffline
	) => {
		const res = await google(
			(response as GoogleLoginResponse).profileObj
		).unwrap()
		dispatch(setCredentials(res))
		history.push(redirect)
	}

	const googleAuthFailureHandler = (response: {
		error: string
		details: string
	}) => {
		setError(response.details)
		setTimeout(() => {
			setError('')
		}, 10000)
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
						<Col md={8}>
							{data && (
								<GoogleLogin
									clientId={data.googleClientId}
									buttonText='Log in with Google'
									onSuccess={googleAuthSuccessHandler}
									onFailure={googleAuthFailureHandler}
									cookiePolicy={'single_host_origin'}
								/>
							)}
						</Col>
						<Col md={4}>
							New Customer?{' '}
							<Link
								to={redirect ? `/register?redirect=${redirect}` : '/register'}
							>
								Register
							</Link>
						</Col>
					</Row>
				</Form>
			</FormContainer>
		</>
	)
}

export default LoginScreen
