import { shopApi } from '.'
import { PaginatedProducts, Product } from '../types'

const productApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllProducts: build.query<
			PaginatedProducts,
			{ keyword?: string; pageNumber?: string; category?: string }
		>({
			query: ({ keyword, pageNumber, category }) =>
				`/product?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}`,
		}),
		getProductById: build.query<Product, { productId: string }>({
			query: ({ productId }) => `/product/${productId}`,
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
