import React from 'react'
import { useState } from 'react'
import { Col, Nav, Row } from 'react-bootstrap'
import { Link, useHistory, useLocation } from 'react-router-dom'
import CategoryPanel from '../components/AdminPanels/CategoryPanel'
import OrdersPanel from '../components/AdminPanels/OrdersPanel'
import ProductsPanel from '../components/AdminPanels/ProductsPanel'
import UsersPanel from '../components/AdminPanels/UsersPanel'
import Meta from '../components/Meta'
import SearchBox from '../components/SearchBox'
import { useAppSelector } from '../hooks'

const AdminScreen = () => {
	const history = useHistory()

	const search = useLocation().search

	const panel = new URLSearchParams(search).get('panel')

	const user = useAppSelector(state => state.authReducer.user)

	if (!user?.isAdmin) {
		history.push('/')
	}

	const [activeTab, setActiveTab] = useState<string>(panel ? panel : 'users')

	const tabHandler = (e: React.MouseEvent<HTMLElement>) => {
		setActiveTab(`${e.currentTarget.dataset.rbEventKey}`)
		history.push(`/admin?panel=${e.currentTarget.dataset.rbEventKey}`)
	}

	return (
		<>
			<Meta title={`Admin Panel | ${activeTab.toUpperCase()}`} />
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

						<Nav.Link eventKey='categories' onClick={tabHandler}>
							Categories
						</Nav.Link>

						{activeTab === 'products' && (
							<>
								<Nav.Link as={Link} to='/product/new'>
									Create new product
								</Nav.Link>
							</>
						)}

						<SearchBox from='/admin' panel={activeTab} />
					</Nav>
				</Col>
				<Col md={10}>
					{activeTab === 'users' && <UsersPanel />}
					{activeTab === 'orders' && <OrdersPanel />}
					{activeTab === 'products' && <ProductsPanel />}
					{activeTab === 'categories' && <CategoryPanel />}
				</Col>
			</Row>
		</>
	)
}

export default AdminScreen
