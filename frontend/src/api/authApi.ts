import { shopApi } from '.'
import { LoginRequest, RegisterRequest, Token } from '../types/auth'

const authApi = shopApi.injectEndpoints({
	endpoints: build => ({
		loginUser: build.mutation<Token, LoginRequest>({
			query: loginCredentials => ({
				url: '/auth/login',
				method: 'POST',
				body: loginCredentials,
				credentials: 'include',
				headers: [
					['Accept', 'application/json'],
					['Access-Control-Allow-Credentials', 'true'],
				],
			}),
		}),
		registerUser: build.mutation<Token, RegisterRequest>({
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
