import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const SearchBox = ({ from }: { from: string }) => {
	const [keyword, setKeyword] = useState('')
	const history = useHistory()

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (keyword.trim()) {
			history.push(`${from}search/${keyword}`)
		} else {
			history.push(`${from}`)
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
