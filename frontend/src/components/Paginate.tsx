import React from 'react'
import { Pagination } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { PaginateProps } from '../types'

const Paginate = ({
	pages,
	page,
	from,
	keyword,
	category,
	panel,
}: PaginateProps) => {
	const history = useHistory()
	return (
		<>
			{pages > 1 && (
				<Pagination className='justify-content-center'>
					{Array.from({ length: pages }, (v, k) => k + 1).map(x => (
						<Pagination.Item
							key={x}
							onClick={() => {
								let pathString = `${from}?pageNumber=${x}`
								if (keyword) pathString = pathString + `&keyword=${keyword}`
								if (category) pathString = pathString + `&category=${category}`
								if (panel) pathString = pathString + `&panel=${panel}`
								history.push(pathString)
							}}
							active={x === Number(page)}
						>
							{x}
						</Pagination.Item>
					))}
				</Pagination>
			)}
		</>
	)
}

export default Paginate
