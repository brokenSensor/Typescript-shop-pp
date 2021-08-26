import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router-dom'
import {
	useUpdateProductByIdMutation,
	useUploadFileMutation,
} from '../api/adminApi'
import { useGetProductByIdQuery } from '../api/productApi'
import Message from '../components/Message'
import { useAppSelector } from '../hooks'

const EditProductScreen = () => {
	const { id: productId }: { id: string } = useParams()

	const [name, setName] = useState('')
	const [brand, setBrand] = useState('')
	const [image, setImage] = useState('')
	const [category, setCategory] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState(0)
	const [countInStock, setCountInStock] = useState(0)

	const [uploading, setUploading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const history = useHistory()

	const userDetails = useAppSelector(state => state.authReducer.user)

	const [updateProduct] = useUpdateProductByIdMutation()
	const [uploadFile] = useUploadFileMutation()
	const { data, refetch: refetchProduct } = useGetProductByIdQuery(productId)

	useEffect(() => {
		if (!userDetails || !userDetails.isAdmin) {
			history.push('/')
		} else {
			if (data) {
				setName(data.name)
				setImage(data.image)
				setBrand(data.brand)
				setCategory(data.category)
				setDescription(data.description)
				setPrice(data.price)
				setCountInStock(data.countInStock)
			}
		}
	}, [data, history, userDetails])

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

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			if (data)
				await updateProduct({
					id: data.id,
					name,
					brand,
					image,
					category,
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
	return (
		<Row className='justify-content-md-center'>
			<Col md={5}>
				<h2>Edit Product {data?.id}</h2>
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
						<Form.Control
							type='text'
							placeholder='Enter category'
							value={category}
							onChange={e => setCategory(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId='image'>
						<Form.Label>Image</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter image url'
							value={image}
							onChange={e => setImage(e.target.value)}
						></Form.Control>
						<Form.Control type='file' onChange={fileSelect}></Form.Control>
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
	)
}

export default EditProductScreen
