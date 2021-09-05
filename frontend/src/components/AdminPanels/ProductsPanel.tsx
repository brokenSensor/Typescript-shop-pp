import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useDeleteProductByIdMutation } from '../../api/adminApi'
import { useGetAllProductsQuery } from '../../api/productApi'
import Loader from '../Loader'
import Paginate from '../Paginate'

const ProductsPanel = () => {
	const search = useLocation().search

	const keyword = new URLSearchParams(search).get('keyword')
	const pageNumber = new URLSearchParams(search).get('pageNumber')
	const panel = new URLSearchParams(search).get('panel')

	const { data, isLoading, refetch } = useGetAllProductsQuery({
		keyword: keyword ? keyword : undefined,
		pageNumber: pageNumber ? pageNumber : undefined,
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
									<th>CATEGORY</th>
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
										<td>{product.category.name}</td>
										<td>{product.price}</td>
										<td>{product.countInStock}</td>
										<td>{product.rating}</td>
										<td>{new Date(product.createdAt).toUTCString()}</td>
										<td>{new Date(product.updatedAt).toUTCString()}</td>
										<td className='text-center'>
											<LinkContainer to={`/product/edit/${product.id}`}>
												<Button variant='light' size='sm'>
													Edit
												</Button>
											</LinkContainer>
										</td>
										<td className='text-center'>
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
							from='/admin'
							panel={panel ? panel : undefined}
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
