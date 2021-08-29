import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useGetAllProductsQuery } from '../api/productApi'
import CustomCarousel from '../components/CustomCarousel'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'
import Paginate from '../components/Paginate'
import Product from '../components/Product'

const MainScreen: React.FC = () => {
	const { keyword, pageNumber } =
		useParams<{ keyword: string; pageNumber: string }>()

	const { isLoading, data, error } = useGetAllProductsQuery({
		keyword,
		pageNumber,
	})
	return (
		<>
			<Meta />
			{!keyword && <CustomCarousel />}
			{
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
									data.products.map(product => (
										<Col key={product.id} sm={12} md={6} lg={4} xl={3}>
											<Product product={product} />
										</Col>
									))}
							</Row>
							{data && (
								<Paginate
									from=''
									pages={data.pages}
									page={data.page}
									keyword={keyword ? keyword : ''}
								/>
							)}
						</>
					)}
				</>
			}
		</>
	)
}

export default MainScreen
