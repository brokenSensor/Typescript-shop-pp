import { shopApi } from '.'
import { PaginatedProduct, PaginatedProducts, Product } from '../types'

const productApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllProducts: build.query<
			PaginatedProducts,
			{ keyword?: string; pageNumber?: string; category?: string }
		>({
			query: ({ keyword, pageNumber, category }) =>
				`/product?keyword=${keyword}&pageNumber=${pageNumber}&category=${category}`,
		}),
		getProductById: build.query<
			PaginatedProduct,
			{ productId: string; reviewPageNumber: string }
		>({
			query: ({ productId, reviewPageNumber }) =>
				`/product/${productId}?reviewPageNumber=${reviewPageNumber}`,
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
