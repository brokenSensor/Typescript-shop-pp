import React from 'react'
import { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'

const SearchBox = ({ from, panel }: { from: string; panel?: string }) => {
	const search = useLocation().search

	const category = new URLSearchParams(search).get('category')

	const [keyword, setKeyword] = useState('')
	const history = useHistory()

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (keyword.trim()) {
			let pathString = `${from}?keyword=${keyword}`
			if (panel) pathString = pathString + `&panel=${panel}`
			if (category) pathString = pathString + `&category=${category}`
			history.push(pathString)
		} else {
			let pathString = `${from}`
			if (panel) pathString = pathString + `?panel=${panel}`
			if (category) pathString = pathString + `?category=${category}`
			history.push(pathString)
		}
	}
	return (
		<Form onSubmit={submitHandler} className='d-flex m-0F'>
			<Form.Control
				type='search'
				onChange={e => setKeyword(e.target.value)}
				className='mr-2'
				aria-label='Search'
			></Form.Control>
		</Form>
	)
}

SearchBox.defaultProps = {
	from: '/',
}

export default SearchBox
