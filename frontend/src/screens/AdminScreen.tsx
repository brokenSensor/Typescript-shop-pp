import React from 'react'
import { useState } from 'react'
import { Col, Nav, Row } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom'
import OrdersPanel from '../components/AdminPanels/OrdersPanel'
import ProductsPanel from '../components/AdminPanels/ProductsPanel'
import UsersPanel from '../components/AdminPanels/UsersPanel'
import SearchBox from '../components/SearchBox'
import { useAppSelector } from '../hooks'

const AdminScreen = () => {
	const history = useHistory()
	const { panel } = useParams<{
		panel: 'users' | 'orders' | 'products'
		keyword: string
		pageNumber: string
	}>()

	const user = useAppSelector(state => state.authReducer.user)

	if (!user?.isAdmin) {
		history.push('/')
	}

	const [activeTab, setActiveTab] = useState<string>(panel ? panel : 'users')

	const tabHandler = (e: React.MouseEvent<HTMLElement>) => {
		setActiveTab(`${e.currentTarget.dataset.rbEventKey}`)
		history.push(`/admin/${e.currentTarget.dataset.rbEventKey}`)
	}

	return (
		<Row>
			<Col md={2}>
				<Nav
					defaultActiveKey={activeTab}
					className='flex-column'
					variant='tabs'
				>
					<Nav.Link eventKey='users' onClick={tabHandler}>
						Users
					</Nav.Link>

					<Nav.Link eventKey='orders' onClick={tabHandler}>
						Orders
					</Nav.Link>

					<Nav.Link eventKey='products' onClick={tabHandler}>
						Products
					</Nav.Link>
					{activeTab === 'users' ? (
						<SearchBox from='/admin/users/' />
					) : activeTab === 'orders' ? (
						<SearchBox from='/admin/orders/' />
					) : (
						activeTab === 'products' && (
							<>
								<Nav.Link as={Link} to='/product/new'>
									Create new product
								</Nav.Link>
								<SearchBox from='/admin/products/' />
							</>
						)
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
