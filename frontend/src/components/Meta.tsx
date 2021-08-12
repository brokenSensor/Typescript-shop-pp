import React from 'react'
import { Helmet } from 'react-helmet'
import { MetaProps } from '../types'

const Meta = ({ title, description, keywords }: MetaProps) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />
		</Helmet>
	)
}

Meta.defaultProps = {
	title: 'Welcome To My First Shop',
}

export default Meta
