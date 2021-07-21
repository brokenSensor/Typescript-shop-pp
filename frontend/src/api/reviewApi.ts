import { shopApi } from '.'
import { Product } from '../types/product'

export type createReviewDto = {
	rating: number
	comment: string
	name: string
	productId: number
}

export type deleteReviewDto = {
	productId: number
	reviewId: number
}

const reviewApi = shopApi.injectEndpoints({
	endpoints: build => ({
		createReview: build.mutation<Product, createReviewDto>({
			query: ReviewDto => ({
				url: `/review/${ReviewDto.productId}`,
				method: 'POST',
				credentials: 'include',
				body: {
					rating: ReviewDto.rating,
					comment: ReviewDto.comment,
					name: ReviewDto.name,
				},
			}),
		}),
		deleteReview: build.mutation<Product, deleteReviewDto>({
			query: ReviewDto => ({
				url: `/review/${ReviewDto.productId}/${ReviewDto.reviewId}`,
				method: 'DELETE',
				credentials: 'include',
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useCreateReviewMutation, useDeleteReviewMutation } = reviewApi
