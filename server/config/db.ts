import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI || '', {})
		console.log('MongoDB connected successfully')
	} catch (err: unknown) {
		if (err instanceof Error) {
			console.error('MongoDB connection failed:', err.message)
		} else {
			console.error('MongoDB connection failed: Unknown error')
		}
		process.exit(1)
	}
}

export default connectDB
