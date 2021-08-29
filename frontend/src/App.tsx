import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useGetPayPalConfigQuery } from './api/orderApi'
import AdminScreen from './screens/AdminScreen'
import EditUserScreen from './screens/EditUserScreen'
import EditProductScreen from './screens/EditProductScreen'
import CreateProductScreen from './screens/CreateProductScreen'

function App() {
	const { data: PayPalConfig } = useGetPayPalConfigQuery()
	return (
		<>
			{PayPalConfig && (
				<PayPalScriptProvider options={{ 'client-id': PayPalConfig.clientId }}>
					<BrowserRouter>
						<Header />
						<main className='py-3'>
							<Container>
								<Switch>
									<Route
										path='/product/new'
										component={CreateProductScreen}
										exact
									/>
									<Route
										path='/product/edit/:id'
										component={EditProductScreen}
										exact
									/>
									<Route path='/user/edit/:id' component={EditUserScreen} />
									<Route
										path='/admin/:panel/page/:pageNumber'
										component={AdminScreen}
										exact
									/>
									<Route
										path='/admin/:panel/search/:keyword/page/:pageNumber'
										component={AdminScreen}
										exact
									/>
									<Route path='/admin/:panel' component={AdminScreen} exact />
									<Route path='/admin' component={AdminScreen} exact />
									<Route path='/profile' component={ProfileScreen} />
									<Route path='/order/:id' component={OrderScreen} />
									<Route path='/orderlist' component={OrderListScreen} />
									<Route path='/placeorder' component={PlaceOrderScreen} />
									<Route path='/payment' component={PaymentScreen} />
									<Route path='/shipping' component={ShippingScreen} />
									<Route path='/cart' component={CartScreen} />
									<Route path='/product/:id' component={ProductScreen} exact />
									<Route path='/login' component={LoginScreen} />
									<Route path='/register' component={RegisterScreen} />
									<Route path='/search/:keyword' component={MainScreen} exact />
									<Route
										path='/page/:pageNumber'
										component={MainScreen}
										exact
									/>
									<Route
										path='/search/:keyword/page/:pageNumber'
										component={MainScreen}
										exact
									/>
									<Route path='/' component={MainScreen} exact />
								</Switch>
							</Container>
						</main>
						<Footer />
					</BrowserRouter>
				</PayPalScriptProvider>
			)}
		</>
	)
}

export default App
