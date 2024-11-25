import mongoose from 'mongoose'
// @ts-ignore
import AutoIncrementFactory from 'mongoose-sequence'

const connection = mongoose.connection
const AutoIncrement = AutoIncrementFactory(connection)

const vacancyDBSchema = new mongoose.Schema({
	company: { type: String, required: true },
	vacancy: { type: String, required: true },
	salaryRange: { type: String, required: true },
	status: { type: String, required: true },
	note: { type: String, required: true },
})

vacancyDBSchema.plugin(AutoIncrement, { inc_field: 'id' })

const VacancyDBModel = mongoose.model('VacancyDB', vacancyDBSchema)

export default VacancyDBModel
