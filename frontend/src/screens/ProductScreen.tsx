import React, { useState } from 'react'
import {
	Alert,
	Button,
	Card,
	Col,
	Form,
	Image,
	ListGroup,
	Row,
} from 'react-bootstrap'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useGetProductByIdQuery } from '../api/productApi'
import { useCreateReviewMutation } from '../api/reviewApi'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Paginate from '../components/Paginate'
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

	const userInfo = useAppSelector(state => state.authReducer.user)

	const { id } = useParams<{
		id: string
	}>()

	const search = useLocation().search

	const pageNumber = new URLSearchParams(search).get('pageNumber')

	const {
		data,
		error,
		isLoading,
		refetch: refetchProduct,
	} = useGetProductByIdQuery({
		productId: id,
		reviewPageNumber: pageNumber ? pageNumber : '1',
	})

	const [createReview] = useCreateReviewMutation()
	return (
		<>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Alert variant='danger'>{error}</Alert>
			) : (
				data && (
					<>
						<Meta
							title={data.product.name}
							description={`${data.product.name} product screen`}
							keywords={`${data.product.name}, ${data.product.brand}, ${data.product.category.name}`}
						/>

						<Row>
							<Col md={6}>
								<Image src={data.product.image} alt={data.product.name} fluid />
							</Col>

							<Col md={{ span: 3, offset: 3 }}>
								<Card>
									<ListGroup variant='flush'>
										<ListGroup.Item>
											<Row>
												<Col>Price:</Col>
												<Col>
													<strong>${data.product.price}</strong>
												</Col>
											</Row>
										</ListGroup.Item>
										<ListGroup.Item>
											<Row>
												<Col>Status:</Col>
												<Col>
													{data.product.countInStock > 0
														? 'In Stock'
														: 'Out Of Stock'}
												</Col>
											</Row>
										</ListGroup.Item>
										{data.product.countInStock > 0 && (
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
																{ length: data.product.countInStock },
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
											{message && <Alert variant='info'>{message}</Alert>}
											<Button
												onClick={() => {
													dispatch(
														addToCart({
															image: data.product.image,
															name: data.product.name,
															price: data.product.price,
															productId: data.product.id,
															qty: qty,
															countInStock: data.product.countInStock,
														})
													)
													setMessage(
														`${qty}  ${data.product.name} added to cart!`
													)

													setTimeout(() => {
														setMessage('')
													}, 10000)
												}}
												className='btn-block'
												type='button'
												size='lg'
												disabled={data.product.countInStock === 0}
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
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<h3>{data.product.name}</h3>
									</ListGroup.Item>
									<ListGroup.Item>
										<Rating
											value={parseFloat(data.product.rating)}
											text={`(${data.product.numReviews})`}
										/>
									</ListGroup.Item>
									<ListGroup.Item>Price: ${data.product.price}</ListGroup.Item>
									<ListGroup.Item>
										Description: {data.product.description}
									</ListGroup.Item>
								</ListGroup>
							</Col>
						</Row>
						<hr />
						<Row>
							<Col md={{ span: 6, offset: 3 }}>
								<h2>Reviews</h2>
								{data.product.reviews.length === 0 && <Alert>No Reviews</Alert>}
								<ListGroup variant='flush'>
									{data.product.reviews.map(review => (
										<ListGroup.Item key={review.id}>
											<strong>{review.name}</strong>
											<Rating value={parseFloat(review.rating)} />
											<p>{new Date(review.createdAt).toLocaleDateString()}</p>
											<p>{review.comment}</p>
										</ListGroup.Item>
									))}
									<Paginate
										from={`/product/${id}`}
										page={data.page}
										pages={data.pages}
									/>
									<ListGroup.Item>
										<h2>Write a Customer Review</h2>
										{reviewError && (
											<Alert variant='danger'>{reviewError}</Alert>
										)}
										{userInfo ? (
											<Form
												className='d-grid gap-2'
												onSubmit={async e => {
													e.preventDefault()
													if (rating !== '') {
														try {
															await createReview({
																comment,
																name: userInfo.name,
																productId: data.product.id,
																rating: Number(rating),
															}).unwrap()
															refetchProduct()
														} catch (error: any) {
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
												{!userInfo.isActivated && (
													<Alert variant='warning'>
														Please confirm your email to leave a review!
													</Alert>
												)}
												<Button
													disabled={!userInfo.isActivated}
													type='submit'
													variant='primary'
												>
													Submit
												</Button>
											</Form>
										) : (
											<Alert variant='info'>
												Please <Link to='/login'>sign in</Link> to write a
												review
											</Alert>
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
