import express from 'express'

class App {
	private express
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

	public start(port: number): void {
		this.express.listen(port, () => {
			console.log(`Server is running on port: ${port}!`)
		})
	}
}

export default new App()
