import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'
import {
	useDeleteUserByIdMutation,
	useGetAllUsersQuery,
} from '../../api/adminApi'
import Loader from '../Loader'
import Paginate from '../Paginate'

const UsersPanel = () => {
	const search = useLocation().search

	const keyword = new URLSearchParams(search).get('keyword')
	const pageNumber = new URLSearchParams(search).get('pageNumber')
	const panel = new URLSearchParams(search).get('panel')

	const { data, isLoading, refetch } = useGetAllUsersQuery({
		keyword: keyword ? keyword : undefined,
		pageNumber: pageNumber ? pageNumber : undefined,
	})

	const [deleteUser] = useDeleteUserByIdMutation()

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
									<th>EMAIL</th>
									<th>IS ACTIVATED</th>
									<th>IS ADMIN</th>
									<th>CREATED AT</th>
									<th>UPDATED AT</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{data.users?.map(user => (
									<tr key={user.id}>
										<td>{user.id}</td>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td className='text-center'>
											{user.isActivated ? (
												<i
													className='fas fa-check'
													style={{ color: 'green' }}
												></i>
											) : (
												<i
													className='fas fa-times'
													style={{ color: 'red' }}
												></i>
											)}
										</td>
										<td className='text-center'>
											{user.isAdmin ? (
												<i
													className='fas fa-check'
													style={{ color: 'green' }}
												></i>
											) : (
												<i
													className='fas fa-times'
													style={{ color: 'red' }}
												></i>
											)}
										</td>
										<td>{new Date(user.createdAt).toUTCString()}</td>
										<td>{new Date(user.updatedAt).toUTCString()}</td>
										<td className='text-center'>
											<LinkContainer to={`/user/edit/${user.id}`}>
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
															'User will be permanently deleted! Are you sure?'
														)
													) {
														deleteUser(user.id)
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

export default UsersPanel
