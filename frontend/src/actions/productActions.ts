import axios from 'axios'
import { Dispatch } from 'redux'
import { ProductListAction, ProductListActionTypes } from '../types/product'

export const listProducts =
	() => async (dispatch: Dispatch<ProductListAction>) => {
		try {
			dispatch({
				type: ProductListActionTypes.PRODUCT_LIST_REQUEST,
			})

			const { data } = await axios.get(`/product`)

			dispatch({
				type: ProductListActionTypes.PRODUCT_LIST_SUCCESS,
				payload: data,
			})
		} catch (error) {
			dispatch({
				type: ProductListActionTypes.PRODUCT_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			})
		}
	}
