import React, { useState } from 'react'
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useGetProductByIdQuery } from '../api/productApi'
import { useCreateReviewMutation } from '../api/reviewApi'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Rating from '../components/Rating'
import { useAppDispatch, useAppSelector } from '../hooks'
import { addToCart } from '../slices/cartSlice'

const ProductScreen = () => {
	const dispatch = useAppDispatch()
	const [qty, setQty] = useState(1)
	const [message, setMessage] = useState('')

	const [comment, setComment] = useState('')
	const [rating, setRating] = useState('')
	const [reviewError, setReviewError] = useState('')

	const authReducer = useAppSelector(state => state.authReducer)
	const { user } = authReducer

	const { id } = useParams<{
		id: string
	}>()
	const {
		data,
		error,
		isLoading,
		refetch: refetchProduct,
	} = useGetProductByIdQuery(id)

	const [createReview] = useCreateReviewMutation()
	return (
		<>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				data && (
					<>
						<Meta title={data.name} />

						<Row>
							<Col md={6}>
								<Image src={data.image} alt={data.name} fluid />
							</Col>
							<Col md={3}>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<h3>{data.name}</h3>
									</ListGroup.Item>
									<ListGroup.Item>
										<Rating value={parseFloat(data.rating)} />
										<p>{data.numReviews} Reviews</p>
									</ListGroup.Item>
									<ListGroup.Item>Price: ${data.price}</ListGroup.Item>
									<ListGroup.Item>
										Description: {data.description}
									</ListGroup.Item>
								</ListGroup>
							</Col>
							<Col md={3}>
								<Card>
									<ListGroup variant='flush'>
										<ListGroup.Item>
											<Row>
												<Col>Price:</Col>
												<Col>
													<strong>${data.price}</strong>
												</Col>
											</Row>
										</ListGroup.Item>
										<ListGroup.Item>
											<Row>
												<Col>Status:</Col>
												<Col>
													{data.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
												</Col>
											</Row>
										</ListGroup.Item>
										{data.countInStock > 0 && (
											<ListGroup.Item>
												<Row>
													<Col>Qty:</Col>
													<Col>
														<Form.Control
															className='text-dark'
															as='select'
															value={qty}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>
															) => {
																setQty(parseInt(e.target.value))
															}}
														>
															{Array.from(
																{ length: data.countInStock },
																(v, k) => k + 1
															).map(x => (
																<option key={x} value={x}>
																	{x}
																</option>
															))}
														</Form.Control>
													</Col>
												</Row>
											</ListGroup.Item>
										)}
										<ListGroup.Item className='d-grid gap-2'>
											{message && <Message>{message}</Message>}
											<Button
												onClick={() => {
													dispatch(
														addToCart({
															image: data.image,
															name: data.name,
															price: data.price,
															productId: data.id,
															qty: qty,
															countInStock: data.countInStock,
														})
													)
													setMessage(`${qty}  ${data.name} added to cart!`)

													setTimeout(() => {
														setMessage('')
													}, 10000)
												}}
												className='btn-block'
												type='button'
												size='lg'
												disabled={data.countInStock === 0}
											>
												Add To Cart
											</Button>
										</ListGroup.Item>
									</ListGroup>
								</Card>
							</Col>
						</Row>
						<Row>
							<Col md={6}>
								<h2>Reviews</h2>
								{data.reviews.length === 0 && <Message>No Reviews</Message>}
								<ListGroup variant='flush'>
									{data.reviews.map(review => (
										<ListGroup.Item key={review.id}>
											<strong>{review.name}</strong>
											<Rating value={parseFloat(review.rating)} />
											<p>{new Date(review.createdAt).toLocaleDateString()}</p>
											<p>{review.comment}</p>
										</ListGroup.Item>
									))}
									<ListGroup.Item>
										<h2>Write a Customer Review</h2>
										{reviewError && (
											<Message variant='danger'>{reviewError}</Message>
										)}
										{user ? (
											<Form
												onSubmit={async e => {
													e.preventDefault()
													if (rating !== '') {
														try {
															await createReview({
																comment,
																name: user.name,
																productId: data.id,
																rating: Number(rating),
															}).unwrap()
															refetchProduct()
														} catch (error) {
															if (Array.isArray(error.data.message)) {
																setReviewError(error.data.message.join(' '))
															} else {
																setReviewError(error.data.message)
															}
															setTimeout(() => {
																setReviewError('')
															}, 10000)
														}
													} else {
														setReviewError('Please select rating')
													}
												}}
											>
												<Form.Group controlId='rating'>
													<Form.Label>Rating</Form.Label>
													<Form.Control
														className='text-dark'
														as='select'
														value={rating}
														onChange={e => setRating(e.target.value)}
													>
														<option value=''>Select...</option>
														<option value='1'>1 - Poor</option>
														<option value='2'>2 - Fair</option>
														<option value='3'>3 - Good</option>
														<option value='4'>4 - Very Good</option>
														<option value='5'>5 - Excellent</option>
													</Form.Control>
												</Form.Group>
												<Form.Group controlId='comment'>
													<Form.Label>Comment</Form.Label>
													<Form.Control
														as='textarea'
														value={comment}
														onChange={e => setComment(e.target.value)}
													></Form.Control>
												</Form.Group>
												<Button type='submit' variant='primary'>
													Submit
												</Button>
											</Form>
										) : (
											<Message>
												Please <Link to='/login'>sign in</Link> to write a
												review
											</Message>
										)}
									</ListGroup.Item>
								</ListGroup>
							</Col>
						</Row>
					</>
				)
			)}
		</>
	)
}

export default ProductScreen
