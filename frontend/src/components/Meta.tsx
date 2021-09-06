import React from 'react'
import { Helmet } from 'react-helmet'
import { MetaProps } from '../types'

const Meta = ({ title, description, keywords }: MetaProps) => {
	return (
		<Helmet>
			{title && <title>{title}</title>}
			{description && <meta name='description' content={description} />}
			{keywords && <meta name='keywords' content={keywords} />}
		</Helmet>
	)
}

Meta.defaultProps = {
	title: 'Welcome To My Shop for Portfolio',
}

export default Meta
