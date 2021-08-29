import React from 'react'
import { Row, Spinner } from 'react-bootstrap'

const Loader = () => {
	return (
		<Row className='justify-content-center'>
			<Spinner animation='border' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</Spinner>
		</Row>
	)
}

export default Loader
