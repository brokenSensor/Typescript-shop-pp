import React from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const SearchBox = () => {
	const [keyword, setKeyword] = useState('')
	const history = useHistory()

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (keyword.trim()) {
			history.push(`/search/${keyword}`)
		} else {
			history.push('/')
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
			<Button type='submit' variant='outline-success' className='p-2'>
				Search
			</Button>
		</Form>
	)
}

export default SearchBox
