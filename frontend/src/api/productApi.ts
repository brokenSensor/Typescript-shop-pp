import { shopApi } from '.'
import { Product } from '../types/product'

const productApi = shopApi.injectEndpoints({
	endpoints: build => ({
		getAllProducts: build.query<Product[], void>({
			query: () => '/product',
		}),
		getProductById: build.query<Product, number>({
			query: id => `/product/${id}`,
		}),
	}),
	overrideExisting: false,
})

export const { useGetAllProductsQuery, useGetProductByIdQuery } = productApi
