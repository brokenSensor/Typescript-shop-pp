import React, { useEffect } from 'react'
import { Alert, Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from 'react-router-dom'
import { useGetAllUserOrdersQuery } from '../api/orderApi'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import { useAppSelector } from '../hooks'

const OrderListScreen = () => {
	const history = useHistory()

	const { data: orders, error, isLoading } = useGetAllUserOrdersQuery()

	const userInfo = useAppSelector(state => state.authReducer.user)

	useEffect(() => {
		if (!userInfo) {
			history.push('/')
		}
	}, [history, userInfo])

	return (
		<>
			<Meta
				title={`Orders | ${userInfo?.name}`}
				description={`Registration page`}
			/>
			<h1>Orders</h1>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Alert variant='danger'>{error}</Alert>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders?.map(order => (
							<tr key={order.id}>
								<td>{order.id}</td>
								<td>{new Date(order.createdAt).toUTCString()}</td>
								<td>{order.totalPrice} $</td>
								<td className='text-center'>
									{order.isPaid ? (
										new Date(order.paidAt).toUTCString()
									) : (
										<i className='fas fa-times' style={{ color: 'red' }}></i>
									)}
								</td>
								<td className='text-center'>
									{order.isDelivered ? (
										new Date(order.deliveredAt).toUTCString()
									) : (
										<i className='fas fa-times' style={{ color: 'red' }}></i>
									)}
								</td>
								<td className='text-center'>
									<LinkContainer to={`/order/${order.id}`}>
										<Button variant='light' size='sm'>
											Details
										</Button>
									</LinkContainer>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	)
}

export default OrderListScreen
