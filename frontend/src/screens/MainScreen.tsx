import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useGetAllProductsQuery } from '../api/productApi'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Product from '../components/Product'

const MainScreen: React.FC = () => {
	const { isLoading, data, error } = useGetAllProductsQuery()
	return (
		<>
			<Meta />
			{isLoading ? (
				<Loader />
			) : error ? (
				<h1>{error}</h1>
			) : (
				<>
					<h1>Latest Products</h1>
					{isLoading ? (
						<Loader />
					) : error ? (
						<Message variant='danger'>{error}</Message>
					) : (
						<>
							<Row>
								{data &&
									data.map(product => (
										<Col key={product.id} sm={12} md={6} lg={4} xl={3}>
											<Product product={product} />
										</Col>
									))}
							</Row>
						</>
					)}
				</>
			)}
		</>
	)
}

export default MainScreen
