import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Footer = () => {
	const year = new Date().getFullYear()
	return (
		<footer>
			<Container>
				<Row>
					<Col className='text-center py-3'>
						{`© ${year} made by Eugeny Hrebtov`}
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
