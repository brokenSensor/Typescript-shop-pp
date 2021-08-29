import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useParams } from 'react-router-dom'
import {
	useDeleteUserByIdMutation,
	useGetAllUsersQuery,
} from '../../api/adminApi'
import Loader from '../Loader'
import Paginate from '../Paginate'

const UsersPanel = () => {
	const { keyword, pageNumber } = useParams<{
		panel: 'users' | 'orders' | 'products'
		keyword: string
		pageNumber: string
	}>()
	const { data, isLoading, refetch } = useGetAllUsersQuery({
		keyword,
		pageNumber,
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
										<td>
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
										<td>
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
										<td>
											<LinkContainer to={`/user/edit/${user.id}`}>
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
						<Paginate from='/admin/users' page={data.page} pages={data.pages} />
					</>
				)
			)}
		</>
	)
}

export default UsersPanel
