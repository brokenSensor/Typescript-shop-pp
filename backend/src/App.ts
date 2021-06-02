import express from 'express'
import sequelize from './config/DBConnect'

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

	public async start(port: number): Promise<void> {
		try {
			await sequelize.authenticate()
			await sequelize.sync()
			this.express.listen(port, () => {
				console.log(`Server is running on port: ${port}!`)
			})
		} catch (error) {
			console.log((error as Error).message)
		}
	}
}

export default new App()
