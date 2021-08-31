import React, { useEffect } from 'react'
import { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import {
	useGetUserQuery,
	useResendActivationMutation,
	useUpdateUserMutation,
} from '../api/authApi'
import Message from '../components/Message'
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
		<Row className='justify-content-md-center'>
			{!data?.isActivated && (
				<Message>
					Your email has not been confirmed yet!{' '}
					<Button onClick={resendActivationHandler}>
						Resend activation link
					</Button>
				</Message>
			)}
			<Col md={5}>
				<h2>User Profile</h2>
				{message && <Message variant='danger'>{message}</Message>}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='name'
							placeholder='Enter name'
							value={name}
							onChange={e => setName(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='email'>
						<Form.Label>Email</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter email'
							value={email}
							onChange={e => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter password'
							value={password}
							onChange={e => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm Password'
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button type='submit' variant='primary'>
						Update
					</Button>
				</Form>
			</Col>
		</Row>
	)
}

export default ProfileScreen
