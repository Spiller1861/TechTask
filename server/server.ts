import express from 'express'
import mongoose from 'mongoose'
import vacancyRoutes from './routes/VacancyRoutes'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

connectDB()

const allowedOrigins = ['https://testtask-production.up.railway.app']
app.use(
	cors({
		origin: allowedOrigins,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
)

app.use(express.json())

app.use('/api/vacancydbs', vacancyRoutes)

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
