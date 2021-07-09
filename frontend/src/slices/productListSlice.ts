import { createSlice } from '@reduxjs/toolkit'

interface productListState {
	loading: boolean
	products: []
	error?: string
}

const initialState: productListState = {
	loading: false,
	products: [],
}

export const productListSlice = createSlice({
	name: 'Product List',
	initialState,
	reducers: {
		// listProducts: async state => {},
	},
})

export default productListSlice.reducer
