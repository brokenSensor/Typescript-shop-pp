export type TokensAndUser = {
	user: UserDto
	access_token: string
	refresh_token: string
}

export type UserDto = {
	id: number
	name: string
	email: string
	isAdmin: boolean
	createdAt: Date
	updatedAt: Date
}

export type LoginRequest = {
	email: string
	password: string
}

export type RegisterRequest = {
	name: string
	email: string
	password: string
}
