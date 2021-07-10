import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import MainScreen from './screens/MainScreen'
import ProductScreen from './screens/ProductScreen'
import LoginScreen from './screens/LoginScreen'

function App() {
	return (
		<BrowserRouter>
			{/* <Header /> */}
			<main>
				<Container>
					<Route path='/product/:id' component={ProductScreen} />
					<Route path='/login' component={LoginScreen} />
					<Route path='/' component={MainScreen} exact />
				</Container>
			</main>
			{/* <Footer /> */}
		</BrowserRouter>
	)
}

export default App
