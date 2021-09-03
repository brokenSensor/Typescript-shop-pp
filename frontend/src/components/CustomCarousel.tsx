import React from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetTopProductsQuery } from '../api/productApi'
import Loader from './Loader'
import Message from './Message'

const CustomCarousel = () => {
	const { data, isLoading, error } = useGetTopProductsQuery()
	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<Carousel pause='hover'>
			{data &&
				data.map(product => (
					<Carousel.Item key={product.id}>
						<Link to={`/product/${product.id}/page/1`}>
							<Image src={product.image} alt={product.name} fluid />
							<Carousel.Caption className='carousel-caption'>
								<h2>
									{product.name} (${product.price})
								</h2>
							</Carousel.Caption>
						</Link>
					</Carousel.Item>
				))}
		</Carousel>
	)
}

export default CustomCarousel
