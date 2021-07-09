import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { useAppSelector } from '../hooks'
import { ProductListState } from '../types/product'

const MainScreen: React.FC = () => {
	const dispatch = useDispatch()
	const productList: ProductListState = useAppSelector(
		state => state.productList
	)
	const { products, loading, error } = productList

	useEffect(() => {
		dispatch(listProducts())
	}, [dispatch])
	return <div></div>
}

export default MainScreen
