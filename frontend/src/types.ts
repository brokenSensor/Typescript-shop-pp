export type Product = {
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
	reviews: []
}
