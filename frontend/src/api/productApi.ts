import { shopApi } from '.'
import { PaginatedProducts, Product } from '../types'

const productApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllProducts: build.query<
			PaginatedProducts,
			{ keyword: string; pageNumber: string }
		>({
			query: ({ keyword, pageNumber }) =>
				`/product?keyword=${keyword}&pageNumber=${pageNumber}`,
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
