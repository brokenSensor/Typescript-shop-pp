import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import MainScreen from './screens/MainScreen'
import ProductScreen from './screens/ProductScreen'
import LoginScreen from './screens/LoginScreen'
import Header from './components/Header'
import RegisterScreen from './screens/RegisterScreen'

function App() {
	return (
		<BrowserRouter>
			<Header />
			<main className='py-3'>
				<Container>
					<Route path='/product/:id' component={ProductScreen} />
					<Route path='/login' component={LoginScreen} />
					<Route path='/register' component={RegisterScreen} />
					<Route path='/' component={MainScreen} exact />
				</Container>
			</main>
			{/* <Footer /> */}
		</BrowserRouter>
	)
}

export default App
