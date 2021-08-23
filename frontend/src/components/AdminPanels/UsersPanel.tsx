import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useGetAllUsersQuery } from '../../api/adminApi'
import Loader from '../Loader'

const UsersPanel = () => {
	const { data: users, isLoading } = useGetAllUsersQuery()

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				users && (
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
							</tr>
						</thead>
						<tbody>
							{users?.map(user => (
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
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										{user.isAdmin ? (
											<i
												className='fas fa-check'
												style={{ color: 'green' }}
											></i>
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
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
								</tr>
							))}
						</tbody>
					</Table>
				)
			)}
		</>
	)
}

export default UsersPanel
