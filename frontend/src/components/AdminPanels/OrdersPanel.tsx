import React from 'react'
import { Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useLocation } from 'react-router-dom'
import {
	useDeleteOrderByIdMutation,
	useGetAllOrdersQuery,
} from '../../api/adminApi'
import Loader from '../Loader'
import Paginate from '../Paginate'

const OrdersPanel = () => {
	const search = useLocation().search

	const keyword = new URLSearchParams(search).get('keyword')
	const pageNumber = new URLSearchParams(search).get('pageNumber')
	const panel = new URLSearchParams(search).get('panel')

	const { data, isLoading, refetch } = useGetAllOrdersQuery({
		keyword: keyword ? keyword : undefined,
		pageNumber: pageNumber ? pageNumber : undefined,
	})

	const [deleteOrder] = useDeleteOrderByIdMutation()

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
									<th>USER</th>
									<th>DATE</th>
									<th>TOTAL</th>
									<th>PAID</th>
									<th>DELIVERED</th>
									<th></th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{data.orders.map(order => (
									<tr key={order.id}>
										<td>{order.id}</td>
										<td>{order.user && order.user.name}</td>
										<td>{new Date(order.createdAt).toUTCString()}</td>
										<td>{order.totalPrice} $</td>
										<td>
											{order.isPaid ? (
												new Date(order.paidAt).toUTCString()
											) : (
												<i
													className='fas fa-times'
													style={{ color: 'red' }}
												></i>
											)}
										</td>
										<td>
											{order.isDelivered ? (
												new Date(order.deliveredAt).toUTCString()
											) : (
												<i
													className='fas fa-times'
													style={{ color: 'red' }}
												></i>
											)}
										</td>
										<td className='text-center'>
											<LinkContainer to={`/order/${order.id}`}>
												<Button variant='light' size='sm'>
													Details
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
															'Order will be permanently deleted! Are you sure?'
														)
													) {
														deleteOrder(order.id)
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

export default OrdersPanel
