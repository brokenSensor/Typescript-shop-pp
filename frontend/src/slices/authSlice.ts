import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokensAndUser, UserDto } from '../types/auth'

export type AithState = {
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
	} as AithState,
	reducers: {
		setCredentials: (state, { payload }: PayloadAction<TokensAndUser>) => {
			state.access_token = payload.access_token
			localStorage.setItem('accessToken', JSON.stringify(payload.access_token))
			state.refresh_token = payload.refresh_token
			state.user = payload.user
			localStorage.setItem('user', JSON.stringify(payload.user))
		},
	},
})

export const { setCredentials } = authSlice.actions

export default authSlice.reducer
