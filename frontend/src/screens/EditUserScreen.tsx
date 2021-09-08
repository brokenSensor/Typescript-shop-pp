import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useGetUserByIdQuery, useUpdateUserByIdMutation } from '../api/adminApi'
import Meta from '../components/Meta'
import { useAppDispatch, useAppSelector } from '../hooks'

const EditUserScreen = () => {
	const { id: userId }: { id: string } = useParams()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)
	const [isActivated, setIsActivated] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const history = useHistory()
	const dispatch = useAppDispatch()

	const userDetails = useAppSelector(state => state.authReducer.user)

	const [updateUser] = useUpdateUserByIdMutation()
	const { data, refetch: refetchUser } = useGetUserByIdQuery(userId)

	useEffect(() => {
		if (!userDetails || !userDetails.isAdmin) {
			history.push('/')
		} else {
			if (data) {
				setName(data.name)
				setEmail(data.email)
				setIsAdmin(data.isAdmin)
				setIsActivated(data.isActivated)
			}
		}
	}, [data, dispatch, history, userDetails])

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			if (data)
				await updateUser({
					id: data.id,
					name,
					email,
					isAdmin,
					isActivated,
				})
			refetchUser()
			setMessage('Profile Edited')
		} catch (error) {
			setMessage('Something went wrong. Please try again')
		}
	}
	return (
		<>
			<Meta
				title={`Admin Panel | Edit User ${data?.id}`}
				description={`Edit user page`}
			/>
			<Row className='justify-content-md-center'>
				<Col md={5}>
					<h2>Edit Profile {data?.id}</h2>
					{message && <Alert variant='danger'>{message}</Alert>}
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

						<Form.Group controlId='isAdmin'>
							<Form.Check
								type='checkbox'
								label='Is Admin'
								checked={isAdmin}
								onChange={() => setIsAdmin(!isAdmin)}
							/>
						</Form.Group>

						<Form.Group controlId='isActivated'>
							<Form.Check
								type='checkbox'
								label='Is Activated'
								checked={isActivated}
								onChange={() => setIsActivated(!isActivated)}
							/>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Edit
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	)
}

export default EditUserScreen
