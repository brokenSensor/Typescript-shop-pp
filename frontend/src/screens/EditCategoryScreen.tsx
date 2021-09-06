import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useUpdateCategoryByIdMutation } from '../api/adminApi'
import { useGetCategoryByIdQuery } from '../api/categoryApi'
import Meta from '../components/Meta'
import { useAppDispatch, useAppSelector } from '../hooks'

const EditCategoryScreen = () => {
	const { id: categoryId }: { id: string } = useParams()

	const [name, setName] = useState('')

	const [message, setMessage] = useState<string | null>(null)

	const history = useHistory()
	const dispatch = useAppDispatch()

	const userDetails = useAppSelector(state => state.authReducer.user)

	const [updateCategory] = useUpdateCategoryByIdMutation()
	const { data, refetch: refetchCategory } = useGetCategoryByIdQuery(
		parseInt(categoryId)
	)

	useEffect(() => {
		if (!userDetails || !userDetails.isAdmin) {
			history.push('/')
		} else {
			if (data) {
				setName(data.name)
			}
		}
	}, [data, dispatch, history, userDetails])

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		try {
			if (data) await updateCategory({ id: data.id, name })
			refetchCategory()
			setMessage('Category Edited')
		} catch (error) {
			setMessage('Something went wrong. Please try again')
		}
	}
	return (
		<>
			<Meta
				title={`Admin Panel | Edit Category ${data?.id}`}
				description={`Edit category page`}
			/>
			<Row className='justify-content-md-center'>
				<Col md={5}>
					<h2>Edit Category {data?.id}</h2>
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

						<Button type='submit' variant='primary'>
							Edit
						</Button>
					</Form>
				</Col>
			</Row>
		</>
	)
}

export default EditCategoryScreen
