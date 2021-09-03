import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, Route, useHistory } from 'react-router-dom'
import { useLogoutUserMutation } from '../api/authApi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { logout } from '../slices/authSlice'
import SearchBox from './SearchBox'

const Header = () => {
	const dispatch = useAppDispatch()
	const { push } = useHistory()
	const user = useAppSelector(state => state.authReducer.user)
	const cartItems = useAppSelector(state => state.cartReducer.items)
	const [logoutServer] = useLogoutUserMutation()
	return (
		<header>
			<Navbar collapseOnSelect expand='lg' bg='secondary' variant='light'>
				<Container>
					<Navbar.Brand as={Link} to='/'>
						My Shop For Portfolio
					</Navbar.Brand>
					<Navbar.Toggle aria-controls='responsive-navbar-nav' />
					<Navbar.Collapse id='responsive-navbar-nav'>
						<Route render={() => <SearchBox />} />
						<Nav className='ml-auto'>
							<Nav.Link as={Link} to='/cart'>
								<i className='fas fa-shopping-cart'> {cartItems.length}</i>
							</Nav.Link>
							{user ? (
								<NavDropdown
									title={user.name}
									id='users-collasible-nav-dropdown'
								>
									<NavDropdown.Item as={Link} to='/profile'>
										Profile
									</NavDropdown.Item>
									<NavDropdown.Item as={Link} to='/orderlist'>
										Orders
									</NavDropdown.Item>
									{user.isAdmin && (
										<>
											<NavDropdown.Divider />
											<NavDropdown.Item as={Link} to='/admin'>
												Admin Panel
											</NavDropdown.Item>
										</>
									)}
									<NavDropdown.Divider />
									<NavDropdown.Item
										onClick={async () => {
											await logoutServer()
											dispatch(logout())
											push('/')
										}}
									>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<Nav.Link as={Link} to='/login'>
									Sign In
								</Nav.Link>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
