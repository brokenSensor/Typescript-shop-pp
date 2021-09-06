import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { CheckoutStepsProps } from '../types'

const CheckoutSteps = ({ step }: CheckoutStepsProps) => {
	return (
		<Nav className='justify-content-center mb-4' variant='tabs'>
			<Nav.Item>
				{step >= 1 ? (
					<LinkContainer to='/login'>
						<Nav.Link>
							Sign In{' '}
							{step !== 1 && step > 1 && (
								<i className='fas fa-check-circle text-success'></i>
							)}
						</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Sign In</Nav.Link>
				)}
			</Nav.Item>
			<Nav.Item>
				{step >= 2 ? (
					<LinkContainer to='/shipping'>
						<Nav.Link>
							Shipping{' '}
							{step !== 2 && step > 2 && (
								<i className='fas fa-check-circle text-success'></i>
							)}
						</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Shipping</Nav.Link>
				)}
			</Nav.Item>
			<Nav.Item>
				{step >= 3 ? (
					<LinkContainer to='/payment'>
						<Nav.Link>
							Payment{' '}
							{step !== 3 && step > 3 && (
								<i className='fas fa-check-circle text-success'></i>
							)}
						</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Payment</Nav.Link>
				)}
			</Nav.Item>
			<Nav.Item>
				{step >= 4 ? (
					<LinkContainer to='/placeorder'>
						<Nav.Link>
							Place Order{' '}
							{step !== 4 && step > 4 && (
								<i className='fas fa-check-circle text-success'></i>
							)}
						</Nav.Link>
					</LinkContainer>
				) : (
					<Nav.Link disabled>Place Order</Nav.Link>
				)}
			</Nav.Item>
			<Nav.Item>
				{step >= 5 ? (
					<Nav.Link>
						Pay For The Order{' '}
						{step !== 5 && step > 5 && (
							<i className='fas fa-check-circle text-success'></i>
						)}
					</Nav.Link>
				) : (
					<Nav.Link disabled>Pay For The Order</Nav.Link>
				)}
			</Nav.Item>
			<Nav.Item>
				{step >= 5 ? (
					<Nav.Link>
						Order Delivered{' '}
						{step !== 6 && step > 6 && (
							<i className='fas fa-check-circle text-success'></i>
						)}
					</Nav.Link>
				) : (
					<Nav.Link disabled>Order Delivered</Nav.Link>
				)}
			</Nav.Item>
		</Nav>
	)
}

export default CheckoutSteps
