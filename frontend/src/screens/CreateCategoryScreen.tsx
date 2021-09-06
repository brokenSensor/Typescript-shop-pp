import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useCreateCategoryMutation } from '../api/adminApi'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { useAppSelector } from '../hooks'

const CreateCategoryScreen = () => {
	const [name, setName] = useState('')

	const [message, setMessage] = useState<string | null>(null)

	const history = useHistory()

	const userDetails = useAppSelector(state => state.authReducer.user)

	const [createCategory] = useCreateCategoryMutation()

	useEffect(() => {
		if (!userDetails || !userDetails.isAdmin) {
			history.push('/')
		}
	}, [history, userDetails])

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			if (userDetails) await createCategory({ userId: userDetails.id, name })
			setMessage('Category Created')
		} catch (error) {
			setMessage('Something went wrong. Please try again')
		}
	}
	return (
		<>
			<Meta
				title={`Admin Panel | Create Category`}
				description={`Create category page`}
			/>
			<Row className='justify-content-md-center'>
				<Col md={5}>
					<h2>Create Category</h2>
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

						<Button type='submit' variant='primary'>
							Create
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	)
}

export default CreateCategoryScreen
