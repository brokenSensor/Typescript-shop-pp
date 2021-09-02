import React from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

const EmailActivationResultScreen = () => {
	const { result } = useParams<{
		result: 'success' | 'failed'
	}>()
	return (
		<Row className='justify-content-center text-center'>
			<Col md={8}>
				<ListGroup variant='flush'>
					<ListGroup.Item>
						{result === 'success' ? (
							<h1>Email confirmed successfully!</h1>
						) : (
							<h1>Something went wrong during email confirmation!</h1>
						)}
					</ListGroup.Item>
				</ListGroup>
			</Col>
		</Row>
	)
}

export default EmailActivationResultScreen
