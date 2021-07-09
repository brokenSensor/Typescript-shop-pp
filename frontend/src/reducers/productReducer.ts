import {
	ProductListAction,
	ProductListActionTypes,
	ProductListState,
} from '../types/product'

const productListInitialState: ProductListState = {
	products: [],
	loading: false,
	error: null,
}

export const productListReducer = (
	state: ProductListState = productListInitialState,
	action: ProductListAction
) => {
	switch (action.type) {
		case ProductListActionTypes.PRODUCT_LIST_REQUEST:
			return { loding: true }
		case ProductListActionTypes.PRODUCT_LIST_SUCCESS:
			return { loading: false, products: action.payload }
		case ProductListActionTypes.PRODUCT_LIST_FAIL:
			return { loading: false, error: action.payload }

		default:
			return state
	}
}
