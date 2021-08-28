import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { PaginateProps } from '../types'

const Paginate = ({
	pages,
	page,
	isAdmin = false,
	keyword = '',
}: PaginateProps) => {
	return (
		<>
			{pages > 1 && (
				<Pagination>
					{Array.from({ length: pages }, (v, k) => k + 1).map(x => (
						<LinkContainer
							key={x}
							to={
								!isAdmin
									? keyword
										? `/search/${keyword}/page/${x}`
										: `/page/${x}`
									: `/admin/productlist/${x}`
							}
						>
							<Pagination.Item active={x === page}>{x}</Pagination.Item>
						</LinkContainer>
					))}
				</Pagination>
			)}
		</>
	)
}

export default Paginate
