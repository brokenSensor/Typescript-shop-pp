import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import MainScreen from './screens/MainScreen'
import ProductScreen from './screens/ProductScreen'
import LoginScreen from './screens/LoginScreen'
import Header from './components/Header'
import RegisterScreen from './screens/RegisterScreen'
import CartScreen from './screens/CartScreen'
import ShippingScreen from './screens/ShippingScreen'
import Footer from './components/Footer'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderListScreen from './screens/OrderListScreen'
import ProfileScreen from './screens/ProfileScreen'

function App() {
	return (
		<BrowserRouter>
			<Header />
			<main className='py-3'>
				<Container>
					<Route path='/profile' component={ProfileScreen} />
					<Route path='/order/:id' component={OrderScreen} />
					<Route path='/orderlist' component={OrderListScreen} />
					<Route path='/placeorder' component={PlaceOrderScreen} />
					<Route path='/payment' component={PaymentScreen} />
					<Route path='/shipping' component={ShippingScreen} />
					<Route path='/cart' component={CartScreen} />
					<Route path='/product/:id' component={ProductScreen} />
					<Route path='/login' component={LoginScreen} />
					<Route path='/register' component={RegisterScreen} />
					<Route path='/' component={MainScreen} exact />
				</Container>
			</main>
			<Footer />
		</BrowserRouter>
	)
}

export default App
