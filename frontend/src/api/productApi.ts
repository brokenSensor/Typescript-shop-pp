import { shopApi } from '.'
import { PaginatedProducts, Product } from '../types'

const productApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllProducts: build.query<
			PaginatedProducts,
			{ keyword?: string; pageNumber?: string; category?: string }
		>({
			query: ({ keyword, pageNumber, category }) =>
				`/api/product?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}`,
		}),
		getProductById: build.query<Product, { productId: string }>({
			query: ({ productId }) => `/api/product/${productId}`,
		}),
		getTopProducts: build.query<Product[], void>({
			query: () => `/api/product/top5`,
		}),
	}),
	overrideExisting: false,
})

export const {
	useGetAllProductsQuery,
	useGetProductByIdQuery,
	useGetTopProductsQuery,
} = productApi
