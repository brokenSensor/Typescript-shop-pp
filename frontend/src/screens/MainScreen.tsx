import React from 'react'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { useGetAllProductsQuery } from '../api/productApi'
import { useReseedDBMutation } from '../api/seederApi'
import CustomCarousel from '../components/CustomCarousel'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Paginate from '../components/Paginate'
import Product from '../components/ProductCard'
import { useAppDispatch } from '../hooks'
import { logout } from '../slices/authSlice'

const MainScreen = () => {
	const dispatch = useAppDispatch()
	const search = useLocation().search

	const keyword = new URLSearchParams(search).get('keyword')
	const pageNumber = new URLSearchParams(search).get('pageNumber')
	const category = new URLSearchParams(search).get('category')

	const { isLoading, data, error } = useGetAllProductsQuery({
		keyword: keyword ? keyword : undefined,
		pageNumber: pageNumber ? pageNumber : undefined,
		category: category ? category : undefined,
	})

	const [reseedDB] = useReseedDBMutation()

	const resetHandler = () => {
		reseedDB()
		dispatch(logout())
		setTimeout(() => {
			window.location.reload()
		}, 3000)
	}
	return (
		<>
			<Meta description='Shops main page' keywords='shop, best products' />
			{!keyword && !pageNumber && !category && (
				<>
					<Alert variant='info'>
						Welcome to my shop project! Make sure to check out Admin panel!{' '}
						<br /> For that log in with: <br /> Email: admin@admin.new <br />{' '}
						Password: 123456 <br /> Shop is open to play around for everyone!{' '}
						<br />
						You can reset it by pressing this button{' '}
						<Button variant='danger' onClick={resetHandler}>
							Reset
						</Button>
					</Alert>
					<CustomCarousel />
				</>
			)}
			{
				<>
					{!keyword && !pageNumber && !category && <h1>Our Products</h1>}
					{category && <h1>{category}</h1>}
					{keyword && <h1>Search: {keyword}</h1>}
					{pageNumber && <h1>Page: {pageNumber}</h1>}
					{isLoading ? (
						<Loader />
					) : error ? (
						<Alert variant='danger'>{error}</Alert>
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
									from='/'
									pages={data.pages}
									page={data.page}
									keyword={keyword ? keyword : ''}
									category={category ? category : ''}
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
