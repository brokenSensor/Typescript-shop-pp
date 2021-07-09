import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { AppDispatch } from '../store'

function MainScreen() {
	const dispatch: AppDispatch = useDispatch()

	const productList = useAppSelector(state => state.productList)
	const { loading, error, products } = productList

	useEffect(() => {
		// dispatch(listProducts())
	}, [dispatch])
	return <div></div>
}

export default MainScreen
