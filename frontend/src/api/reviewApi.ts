import { shopApi } from '.'
import {
	CreateReviewDto,
	DeleteReviewDto,
	PaginatedReviews,
	Product,
} from '../types'

const reviewApi = shopApi.injectEndpoints({
	endpoints: build => ({
		createReview: build.mutation<Product, CreateReviewDto>({
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
		deleteReview: build.mutation<Product, DeleteReviewDto>({
			query: ReviewDto => ({
				url: `/review/${ReviewDto.productId}/${ReviewDto.reviewId}`,
				method: 'DELETE',
				credentials: 'include',
			}),
		}),
		getAllReviewsById: build.query<
			PaginatedReviews,
			{ productId: number; page?: string }
		>({
			query: ({ productId, page }) => `/review/${productId}?page=${page}`,
		}),
	}),
	overrideExisting: false,
})

export const {
	useCreateReviewMutation,
	useDeleteReviewMutation,
	useGetAllReviewsByIdQuery,
} = reviewApi
