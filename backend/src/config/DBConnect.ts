import mongoose from 'mongoose'

const DBConnect = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true,
		})
		console.log(`MongoDB Connected: ${connection.connection.host}`)
	} catch (error) {
		console.log((error as Error).message)
	}
}

export default DBConnect
