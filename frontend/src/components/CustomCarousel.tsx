import React from 'react'
import { Alert, Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetTopProductsQuery } from '../api/productApi'
import Loader from './Loader'

const CustomCarousel = () => {
	const { data, isLoading, error } = useGetTopProductsQuery()
	return isLoading ? (
		<Loader />
	) : error ? (
		<Alert variant='danger'>{error}</Alert>
	) : (
		<Carousel pause='hover'>
			{data &&
				data.map(product => (
					<Carousel.Item key={product.id}>
						<Link to={`/product/${product.id}`}>
							<Image src={product.image} alt={product.name} fluid />
							<Carousel.Caption>
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
