import { shopApi } from '.'
import { LoginRequest, RegisterRequest, TokensAndUser } from '../types'

const authApi = shopApi.injectEndpoints({
	endpoints: build => ({
		loginUser: build.mutation<TokensAndUser, LoginRequest>({
			query: loginCredentials => ({
				url: '/auth/login',
				method: 'POST',
				body: loginCredentials,
				credentials: 'include',
			}),
		}),
		registerUser: build.mutation<TokensAndUser, RegisterRequest>({
			query: registerCredentials => ({
				url: '/auth/register',
				method: 'POST',
				body: registerCredentials,
				credentials: 'include',
			}),
		}),
		logoutUser: build.mutation<void, void>({
			query: () => ({
				url: '/auth/logout',
				method: 'POST',
				credentials: 'include',
			}),
		}),
	}),
	overrideExisting: false,
})

export const {
	useLoginUserMutation,
	useRegisterUserMutation,
	useLogoutUserMutation,
} = authApi
