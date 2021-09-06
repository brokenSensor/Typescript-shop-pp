import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'
import {
	useDeleteCategoryByIdMutation,
	useGetAllCategoriesForAdminQuery,
} from '../../api/adminApi'
import Loader from '../Loader'
import Paginate from '../Paginate'

const CategoryPanel = () => {
	const search = useLocation().search

	const keyword = new URLSearchParams(search).get('keyword')
	const pageNumber = new URLSearchParams(search).get('pageNumber')
	const panel = new URLSearchParams(search).get('panel')

	const { data, isLoading, refetch } = useGetAllCategoriesForAdminQuery({
		keyword: keyword ? keyword : undefined,
		pageNumber: pageNumber ? pageNumber : undefined,
	})

	const [deleteCategory] = useDeleteCategoryByIdMutation()

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				data && (
					<>
						<Table striped bordered hover responsive className='table-sm'>
							<thead>
								<tr>
									<th>ID</th>
									<th>NAME</th>
									<th>CREATOR</th>
									<th>CREATED AT</th>
									<th>UPDATED AT</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{data.categories.map(category => (
									<tr key={category.id}>
										<td>{category.id}</td>
										<td>{category.name}</td>
										<td>{category.user.name}</td>
										<td>{new Date(category.createdAt).toUTCString()}</td>
										<td>{new Date(category.updatedAt).toUTCString()}</td>
										<td className='text-center'>
											<LinkContainer to={`/category/edit/${category.id}`}>
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
															"Category will be permanently deleted! Only possible if all related entity's already deleted! Are you sure?"
														)
													) {
														deleteCategory(category.id)
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

export default CategoryPanel
