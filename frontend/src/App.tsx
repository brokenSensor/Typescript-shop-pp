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
import EmailActivationResultScreen from './screens/EmailActivationResultScreen'
import CreateProductScreen from './screens/CreateProductScreen'
import EditCategoryScreen from './screens/EditCategoryScreen'

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
										path='/activation/:result'
										component={EmailActivationResultScreen}
										exact
									/>
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
									<Route
										path='/category/edit/:id'
										component={EditCategoryScreen}
										exact
									/>
									<Route path='/user/edit/:id' component={EditUserScreen} />
									<Route path='/admin' component={AdminScreen} exact />
									<Route path='/profile' component={ProfileScreen} />
									<Route path='/order/:id' component={OrderScreen} />
									<Route path='/orderlist' component={OrderListScreen} />
									<Route path='/placeorder' component={PlaceOrderScreen} />
									<Route path='/payment' component={PaymentScreen} />
									<Route path='/shipping' component={ShippingScreen} />
									<Route path='/cart' component={CartScreen} />
									<Route
										path='/product/:id/page/:reviewPageNumber'
										component={ProductScreen}
										exact
									/>
									<Route path='/login' component={LoginScreen} />
									<Route path='/register' component={RegisterScreen} />
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
