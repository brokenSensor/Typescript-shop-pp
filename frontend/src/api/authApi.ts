import { shopApi } from '.'
import { LoginRequest, RegisterRequest, TokensAndUser } from '../types/auth'

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
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useLoginUserMutation, useRegisterUserMutation } = authApi
