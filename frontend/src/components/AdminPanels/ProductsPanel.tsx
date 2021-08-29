import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDeleteProductByIdMutation } from '../../api/adminApi'
import { useGetAllProductsQuery } from '../../api/productApi'
import Loader from '../Loader'
import Paginate from '../Paginate'

const ProductsPanel = () => {
	const { keyword, pageNumber } = useParams<{
		panel: 'users' | 'orders' | 'products'
		keyword: string
		pageNumber: string
	}>()
	const { data, isLoading, refetch } = useGetAllProductsQuery({
		keyword,
		pageNumber,
	})

	const [deleteProduct] = useDeleteProductByIdMutation()

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				data?.products && (
					<>
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
										<td>
											<Button
												variant='danger'
												size='sm'
												onClick={() => {
													if (
														window.confirm(
															'Product will be permanently deleted! Are you sure?'
														)
													) {
														deleteProduct(product.id)
														refetch()
													}
												}}
											>
												<i className='fas fa-trash-alt'></i>
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Paginate
							from='/admin/products'
							page={data.page}
							pages={data.pages}
						/>
					</>
				)
			)}
		</>
	)
}

export default ProductsPanel
