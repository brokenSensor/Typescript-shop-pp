export type Product = {
	id: number
	name: string
	image: string
	brand: string
	category: string
	description: string
	rating: string
	numReviews: number
	price: number
	countInStock: number
	createdAt: Date
	updatedAt: Date
	reviews: Review[]
}

type Review = {
	id: number
	rating: string
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

export type CartItem = {
	name: string
	qty: number
	image: string
	price: number
	productId: number
	countInStock: number
}
