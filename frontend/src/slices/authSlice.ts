import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokensAndUser, UserDto } from '../types/auth'

export type AuthState = {
	user: UserDto | null
	access_token: string | null
	refresh_token: string | null
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: JSON.parse(localStorage.getItem('user') || 'null'),
		access_token: JSON.parse(localStorage.getItem('accessToken') || 'null'),
		refresh_token: null,
	} as AuthState,
	reducers: {
		setCredentials: (state, { payload }: PayloadAction<TokensAndUser>) => {
			state.access_token = payload.access_token
			localStorage.setItem('accessToken', JSON.stringify(payload.access_token))
			state.refresh_token = payload.refresh_token
			state.user = payload.user
			localStorage.setItem('user', JSON.stringify(payload.user))
		},
		logout: state => {
			state.access_token = null
			localStorage.removeItem('accessToken')
			state.refresh_token = null
			localStorage.removeItem('refreshToken')
			state.user = null
			localStorage.removeItem('user')
		},
	},
})

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
