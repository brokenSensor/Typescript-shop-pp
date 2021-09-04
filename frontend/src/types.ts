export type TokensAndUser = {
	user: UserDto
	access_token: string
	refresh_token: string
}

export type UserDto = {
	id: number
	name: string
	email: string
	isAdmin: boolean
	strategy: string
	createdAt: Date
	updatedAt: Date
	isActivated: boolean
}

export type LoginRequest = {
	email: string
	password: string
}

export type RegisterRequest = {
	name: string
	email: string
	password: string
	strategy: string
}

export type CastomError = {
	status: number
	data: {
		error: string
		message: string[]
	}
}

export type Product = {
	id: number
	name: string
	image: string
	brand: string
	category: Category
	description: string
	rating: string
	numReviews: number
	price: number
	countInStock: number
	createdAt: Date
	updatedAt: Date
	reviews: Review[]
}

export type Review = {
	id: number
	rating: string
	comment: string
	name: string
	createdAt: Date
	updatedAt: Date
}

export type ProductListState = {
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

export type ShippingAddress = {
	address: string
	city: string
	postalCode: string
	country: string
}

export type AuthState = {
	user: UserDto | null
	access_token: string | null
	refresh_token: string | null
}

export type CartState = {
	items: CartItem[]
	shippingAddress: ShippingAddress
	paymentMethod: PaymentMethod
}

export type RatingProps = {
	value: number
	text?: string
	color: string
}

export type ProductProps = {
	product: Product
}

export type MetaProps = {
	title?: string
	description?: string
	keywords?: string
}

export type MessageProps = {
	children: React.ReactNode
	variant: string
}

export type CreateReviewDto = {
	rating: number
	comment: string
	name: string
	productId: number
}

export type DeleteReviewDto = {
	productId: number
	reviewId: number
}

export type PaymentMethod = string

export type CheckoutStepsProps = {
	step1?: any
	step2?: any
	step3?: any
	step4?: any
}

export type CreateOrderDto = {
	orderItems: OrderItem[]
	shippingAddress: ShippingAddress
	paymentMethod: string
	itemsPrice: number
	taxPrice?: number
	shippingPrice?: number
	totalPrice: number
}

export type OrderItem = {
	name: string
	qty: number
	image: string
	price: number
	productId: number
}

export type Order = {
	id: number
	user: UserDto
	orderItems: OrderItem[]
	shippingAddress: ShippingAddress
	paymentMethod: string
	paymentResult: PaymentResult
	itemsPrice: number
	taxPrice: number
	shippingPrice: number
	totalPrice: number
	isPaid: boolean
	paidAt: Date
	isDelivered: boolean
	deliveredAt: Date
	createdAt: Date
	updatedAt: Date
}

export type PaymentResult = {
	status: string
	update_time: string
	email_address: string
}

export type UpdateUserDto = {
	id?: number
	name?: string
	email?: string
	password?: string
	isAdmin?: boolean
}

export type User = {
	id: number
	name: string
	email: string
	isActivated: boolean
	isAdmin: boolean
	createdAt: Date
	updatedAt: Date
}

export type CreateProductDto = {
	name: string
	image: string
	brand: string
	category: Category
	description: string
	price: number
	countInStock: number
}

export type UpdateProductDto = {
	id: number
	name?: string
	image?: string
	brand?: string
	category?: Category
	description?: string
	price?: number
	countInStock?: number
}

export type PaginateProps = {
	pages: number
	page: number
	from: string
	keyword?: string
}

export type PaginatedProducts = {
	pages: number
	page: number
	products: Product[]
}

export type PaginatedProduct = {
	pages: number
	page: number
	product: Product
}

export type PaginatedOrders = {
	pages: number
	page: number
	orders: Order[]
}

export type PaginatedUsers = {
	pages: number
	page: number
	users: User[]
}

export type GoogleProfile = {
	googleId: string
	imageUrl: string
	email: string
	name: string
	givenName: string
	familyName: string
}

export type Category = {
	id: number
	name: string
	user: User
	createdAt: Date
	updatedAt: Date
}

export type CreateCategoryDto = {
	name: string
	userId: number
}
