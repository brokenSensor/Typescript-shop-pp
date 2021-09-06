import React, { useEffect } from 'react'
import { useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import {
	useGetUserQuery,
	useResendActivationMutation,
	useUpdateUserMutation,
} from '../api/authApi'
import Meta from '../components/Meta'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setUser } from '../slices/authSlice'

const ProfileScreen = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [message, setMessage] = useState<string | null>(null)

	const history = useHistory()
	const dispatch = useAppDispatch()

	const userDetails = useAppSelector(state => state.authReducer.user)

	const [updateUser] = useUpdateUserMutation()
	const { data, refetch: refetchUser } = useGetUserQuery()
	const [resendActivation] = useResendActivationMutation()

	useEffect(() => {
		if (!userDetails) {
			history.push('/login')
		} else {
			if (data) dispatch(setUser(data))
			setName(userDetails.name)
			setEmail(userDetails.email)
		}
	}, [data, dispatch, history, userDetails])

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setMessage('Passwords do not match')
		} else {
			try {
				await updateUser({ name, email, password })
				refetchUser()
				if (data) dispatch(setUser(data))
				setMessage('Profile Updated')
			} catch (error) {
				setMessage('Something went wrong. Please try again')
			}
		}
	}

	const resendActivationHandler = () => {
		resendActivation()
	}
	return (
		<>
			<Meta
				title={`Profile | ${data?.name}`}
				description={`${data?.name} profile page`}
			/>
			<Row className='justify-content-md-center'>
				{data && !data.isActivated && (
					<Alert variant='warning'>
						Your email has not been confirmed yet!{' '}
						<Button variant='warning' onClick={resendActivationHandler}>
							Resend activation link
						</Button>
					</Alert>
				)}
				<Col md={5}>
					<h2>User Profile</h2>
					{message && <Alert variant='danger'>{message}</Alert>}
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								disabled={data?.strategy === 'local' ? false : true}
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={e => setName(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='email'>
							<Form.Label>Email</Form.Label>
							<Form.Control
								disabled={data?.strategy === 'local' ? false : true}
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={e => setEmail(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='password'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								disabled={data?.strategy === 'local' ? false : true}
								type='password'
								placeholder='Enter password'
								value={password}
								onChange={e => setPassword(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='confirmPassword'>
							<Form.Label>Confirm Password</Form.Label>
							<Form.Control
								disabled={data?.strategy === 'local' ? false : true}
								type='password'
								placeholder='Confirm Password'
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Button
							type='submit'
							variant='primary'
							disabled={data?.strategy === 'local' ? false : true}
						>
							Update
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	)
}

export default ProfileScreen
