import React from 'react'
import { Alert } from 'react-bootstrap'
import { MessageProps } from '../types'

const Message = ({ variant, children }: MessageProps) => {
	return (
		<Alert className='text-dark' variant={variant}>
			{children}
		</Alert>
	)
}

Message.defaultProps = {
	variant: 'info',
}

export default Message
