import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useGetAllProductsQuery } from '../api/productApi'

const MainScreen: React.FC = () => {
	const { isLoading, data, error } = useGetAllProductsQuery()
	return (
		<>
			{isLoading ? (
				<h1>Loading...</h1>
			) : error ? (
				<h1>{error}</h1>
			) : (
				<>
					<Row>
						{data &&
							data.map(product => (
								<Col key={product.id} sm={12} md={6} lg={4} xl={3}>
									<Link to={`/product/${product.id}`}>
										<h3>{product.name}</h3>
									</Link>
								</Col>
							))}
					</Row>
				</>
			)}
		</>
	)
}

export default MainScreen
