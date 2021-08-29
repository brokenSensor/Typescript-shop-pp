import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useHistory } from 'react-router-dom'
import { PaginateProps } from '../types'

const Paginate = ({ pages, page, from, keyword = '' }: PaginateProps) => {
	const history = useHistory()
	return (
		<>
			{pages > 1 && (
				<Pagination className='justify-content-center'>
					{Array.from({ length: pages }, (v, k) => k + 1).map(x => (
						<Pagination.Item
							key={x}
							onClick={() => {
								history.push(
									keyword
										? `${from}/search/${keyword}/page/${x}`
										: `${from}/page/${x}`
								)
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
