import React, { useState } from 'react'
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useGetProductByIdQuery } from '../api/productApi'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Rating from '../components/Rating'

const ProductScreen = () => {
	const [qty, setQty] = useState(1)

	const { id } = useParams<{
		id: string
	}>()
	const { data, error, isLoading } = useGetProductByIdQuery(parseInt(id))
	return (
		<>
			<Link className='btn btn-light my-3' to='/'>
				Go Back
			</Link>
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
										<Rating
											value={parseFloat(data.rating)}
											text={`${data.numReviews} reviews`}
										/>
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
													<Col>Qty</Col>
													<Col>
														<Form.Control
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
										<ListGroup.Item>
											{/* <Button
												onClick={addToCartHandler}
												className='btn-block'
												type='button'
												disabled={data.countInStock === 0}
											>
												Add To Cart
											</Button> */}
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
											<p>{review.createdAt}</p>
											<p>{review.comment}</p>
										</ListGroup.Item>
									))}
									{/* <ListGroup.Item>
										<h2>Write a Customer Review</h2>
										{errorProductReview && (
											<Message variant='danger'>{errorProductReview}</Message>
										)}
										{user ? (
											<Form onSubmit={submitHandler}>
												<Form.Group controlId='rating'>
													<Form.Label>Rating</Form.Label>
													<Form.Control
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
									</ListGroup.Item> */}
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
