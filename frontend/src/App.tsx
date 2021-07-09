import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import MainScreen from './screens/MainScreen'

function App() {
	return (
		<BrowserRouter>
			{/* <Header /> */}
			<main>
				<Container>
					<Route path='/' component={MainScreen} exact />
				</Container>
			</main>
			{/* <Footer /> */}
		</BrowserRouter>
	)
}

export default App
