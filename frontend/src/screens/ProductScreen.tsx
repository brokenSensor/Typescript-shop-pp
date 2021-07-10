import React from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useGetProductByIdQuery } from '../api/productApi'

const ProductScreen = () => {
	const { id } = useParams<{
		id: string
	}>()
	const { data } = useGetProductByIdQuery(parseInt(id))
	return (
		<div>
			{data && (
				<h1>
					{data.id}, {data.name}
				</h1>
			)}
		</div>
	)
}

export default ProductScreen
