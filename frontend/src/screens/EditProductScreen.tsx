import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import { useUpdateProductByIdMutation } from '../api/adminApi'
import { useGetAllCategoriesQuery } from '../api/categoryApi'
import { useGetProductByIdQuery } from '../api/productApi'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { useAppSelector } from '../hooks'

const EditProductScreen = () => {
	const { id: productId }: { id: string } = useParams()

	const [name, setName] = useState('')
	const [brand, setBrand] = useState('')
	const [image, setImage] = useState('')
	const [category, setCategory] = useState('0')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState(0)
	const [countInStock, setCountInStock] = useState(0)

	const [uploading, setUploading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const history = useHistory()

	const userDetails = useAppSelector(state => state.authReducer.user)

	const [updateProduct] = useUpdateProductByIdMutation()
	const { data, refetch: refetchProduct } = useGetProductByIdQuery({
		productId,
		reviewPageNumber: '1',
	})
	const { data: categories } = useGetAllCategoriesQuery()

	useEffect(() => {
		if (!userDetails || !userDetails.isAdmin) {
			history.push('/')
		} else {
			if (data && categories) {
				setName(data.product.name)
				setImage(data.product.image)
				setBrand(data.product.brand)
				setCategory(
					`${categories.findIndex(v => v.id === data.product.category.id)}`
				)
				setDescription(data.product.description)
				setPrice(data.product.price)
				setCountInStock(data.product.countInStock)
			}
		}
	}, [categories, data, history, userDetails])

	const fileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		let file
		if (e.currentTarget.files) {
			file = e.currentTarget.files[0]
			const formData = new FormData()
			formData.append('image', file)
			setUploading(true)
			try {
				const res = await fetch('/product/upload', {
					body: formData,
					method: 'post',
				})
				setImage((await res.json()).filePath)

				setUploading(false)
			} catch (error) {
				console.log(error)
				setUploading(false)
			}
		}
	}

	const setCategoryHandler = (e: React.FormEvent<HTMLSelectElement>) => {
		setCategory(e.currentTarget.value)
	}

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (categories) {
			try {
				if (data)
					await updateProduct({
						id: data.product.id,
						name,
						brand,
						image,
						category: categories[parseInt(category)],
						description,
						price,
						countInStock,
					})
				refetchProduct()
				setMessage('Product Edited')
			} catch (error) {
				setMessage('Something went wrong. Please try again')
			}
		}
	}
	return (
		<>
			<Meta
				title={`Admin Panel | Edit Product ${data?.product.id}`}
				description={`Edit product page`}
			/>
			<Row className='justify-content-md-center'>
				<Col md={5}>
					<h2>Edit Product {data?.product.id}</h2>
					{message && <Message variant='danger'>{message}</Message>}
					<Form onSubmit={submitHandler} name='productForm'>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={e => setName(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter price'
								value={price}
								onChange={e => setPrice(Number(e.target.value))}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='brand'>
							<Form.Label>Brand</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter brand'
								value={brand}
								onChange={e => setBrand(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='countInStock'>
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter Count In Stock'
								value={countInStock}
								onChange={e => setCountInStock(Number(e.target.value))}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='category'>
							<Form.Label>Category</Form.Label>
							{categories && (
								<Form.Select
									aria-label='Category'
									onChange={setCategoryHandler}
									value={category}
								>
									{categories.map((category, index) => (
										<option key={index} value={index}>
											{category.name}
										</option>
									))}
								</Form.Select>
							)}
						</Form.Group>

						<Form.Group controlId='image'>
							<Form.Label>Image</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter image url'
								value={image}
								onChange={e => setImage(e.target.value)}
							></Form.Control>
							{uploading ? (
								<Loader />
							) : (
								<Form.Control type='file' onChange={fileSelect}></Form.Control>
							)}
						</Form.Group>

						<Form.Group controlId='description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter description'
								value={description}
								onChange={e => setDescription(e.target.value)}
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

export default EditProductScreen
