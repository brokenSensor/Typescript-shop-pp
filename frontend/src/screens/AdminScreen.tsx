import React from 'react'
import { useState } from 'react'
import { Col, Nav, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import OrdersPanel from '../components/AdminPanels/OrdersPanel'
import ProductsPanel from '../components/AdminPanels/ProductsPanel'
import UsersPanel from '../components/AdminPanels/UsersPanel'
import { useAppSelector } from '../hooks'

const AdminScreen = () => {
	const history = useHistory()

	const user = useAppSelector(state => state.authReducer.user)

	if (!user?.isAdmin) {
		history.push('/')
	}

	const [activeTab, setActiveTab] = useState<string | null>('users')

	return (
		<Row>
			<Col md={2}>
				<Nav
					defaultActiveKey='users'
					className='flex-column'
					variant='tabs'
					onSelect={selectedKey => {
						setActiveTab(selectedKey)
					}}
				>
					<Nav.Link eventKey='users'>Users</Nav.Link>

					<Nav.Link eventKey='orders'>Orders</Nav.Link>

					<Nav.Link eventKey='products'>Products</Nav.Link>
					{activeTab === 'products' && (
						<Nav.Link as={Link} to='/product/new'>
							Create new product
						</Nav.Link>
					)}
				</Nav>
			</Col>
			<Col md={10}>
				{activeTab === 'users' && <UsersPanel />}
				{activeTab === 'orders' && <OrdersPanel />}
				{activeTab === 'products' && <ProductsPanel />}
			</Col>
		</Row>
	)
}

export default AdminScreen
