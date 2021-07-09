export enum ProductListActionTypes {
	PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST',
	PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS',
	PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL',
}

interface ProductListRequestAction {
	type: ProductListActionTypes.PRODUCT_LIST_REQUEST
}

interface ProductListSuccessAction {
	type: ProductListActionTypes.PRODUCT_LIST_SUCCESS
	payload: Product[]
}

interface ProductListFailAction {
	type: ProductListActionTypes.PRODUCT_LIST_FAIL
	payload: string
}

type Product = {
	id: number
	name: string
	image: string
	brand: string
	category: string
	description: string
	rating: number
	numReviews: number
	price: number
	countInStock: number
	createdAt: Date
	updatedAt: Date
	reviews: Review[]
}

type Review = {
	id: number
	rating: number
	comment: string
	name: string
	createdAt: Date
	updatedAt: Date
}

export interface ProductListState {
	products: Product[]
	loading: boolean
	error: string | null
}

export type ProductListAction =
	| ProductListRequestAction
	| ProductListSuccessAction
	| ProductListFailAction
