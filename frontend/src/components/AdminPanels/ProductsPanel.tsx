import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'
import { useGetAllProductsQuery } from '../../api/productApi'
import Loader from '../Loader'

const ProductsPanel = () => {
	const { data, isLoading } = useGetAllProductsQuery({
		keyword: '',
		pageNumber: '',
	})

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				data?.products && (
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>COUNT IN STOCK</th>
								<th>RATING</th>
								<th>CREATED AT</th>
								<th>UPDATED AT</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{data.products?.map(product => (
								<tr key={product.id}>
									<td>{product.id}</td>
									<td>
										<Link to={`/product/${product.id}`}>{product.name}</Link>
									</td>
									<td>{product.price}</td>
									<td>{product.countInStock}</td>
									<td>{product.rating}</td>
									<td>{new Date(product.createdAt).toUTCString()}</td>
									<td>{new Date(product.updatedAt).toUTCString()}</td>
									<td>
										<LinkContainer to={`/product/edit/${product.id}`}>
											<Button variant='light' size='sm'>
												Edit
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)
			)}
		</>
	)
}

export default ProductsPanel
