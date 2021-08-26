import { shopApi } from '.'
import { Product } from '../types'

const productApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllProducts: build.query<Product[], void>({
			query: () => '/product',
		}),
		getProductById: build.query<Product, string>({
			query: id => `/product/${id}`,
		}),
		getTopProducts: build.query<Product[], void>({
			query: () => `/product/top5`,
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetAllProductsQuery,
	useGetProductByIdQuery,
	useGetTopProductsQuery,
} = productApi
