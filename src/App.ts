import express from 'express'

class App {
	public express
	constructor() {
		this.express = express()
		this.loadRoutes()
	}

	private loadRoutes(): void {
		const router = express.Router()
		router.get('/', (req, res) => {
			res.json({
				message: 'Hello',
			})
		})
		this.express.use('/', router)
	}
}

export default new App().express
