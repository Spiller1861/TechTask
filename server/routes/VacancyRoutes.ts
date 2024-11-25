import express, { Request, Response } from 'express'
import VacancyDBModel from '../models/VacancyDB'

const router = express.Router()

interface VacancyDBBody {
	company: string
	vacancy: string
	salaryRange: string
	status: string
	note: string
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const vacancies = await VacancyDBModel.find()
		res.json(
			vacancies.map(vacancy => ({
				id: vacancy.id,
				company: vacancy.company,
				vacancy: vacancy.vacancy,
				salaryRange: vacancy.salaryRange,
				status: vacancy.status,
				note: vacancy.note,
			}))
		)
	} catch (err) {
		console.error('Error fetching vacancies:', err)
		res.status(500).json({ error: 'Failed to fetch vacancies' })
	}
})

router.post(
	'/',
	async (req: Request<{}, {}, VacancyDBBody>, res: Response): Promise<void> => {
		try {
			const { company, vacancy, salaryRange, status, note } = req.body

			if (!company || !vacancy || !salaryRange || !status || !note) {
				res.status(400).json({ message: 'All fields are required' })
				return
			}

			const newVacancyDB = new VacancyDBModel({
				company,
				vacancy,
				salaryRange,
				status,
				note,
			})

			await newVacancyDB.save()

			res.status(201).json({
				id: newVacancyDB.id,
				company,
				vacancy,
				salaryRange,
				status,
				note,
			})
		} catch (err) {
			console.error('Error creating vacancyDB:', err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
)
router.put(
	'/:id',
	async (
		req: Request<{ id: string }, {}, VacancyDBBody>,
		res: Response
	): Promise<void> => {
		try {
			const { id } = req.params
			const { company, vacancy, salaryRange, status, note } = req.body

			if (!company || !vacancy || !salaryRange || !status || !note) {
				res.status(400).json({ message: 'All fields are required' })
				return
			}

			const updatedVacancyDB = await VacancyDBModel.findOneAndUpdate(
				{ id },
				{ company, vacancy, salaryRange, status, note },
				{ new: true }
			)

			if (!updatedVacancyDB) {
				res.status(404).json({ message: 'VacancyDB not found' })
				return
			}

			res.status(200).json({
				id: updatedVacancyDB.id,
				company: updatedVacancyDB.company,
				vacancy: updatedVacancyDB.vacancy,
				salaryRange: updatedVacancyDB.salaryRange,
				status: updatedVacancyDB.status,
				note: updatedVacancyDB.note,
			})
		} catch (err) {
			console.error('Error updating vacancyDB:', err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
)

router.delete(
	'/:id',
	async (req: Request<{ id: string }>, res: Response): Promise<void> => {
		try {
			const { id } = req.params
			const deletedVacancyDB = await VacancyDBModel.findOneAndDelete({ id })

			if (!deletedVacancyDB) {
				res.status(404).json({ message: 'VacancyDB not found' })
				return
			}

			res.status(200).json({ message: 'VacancyDB deleted successfully' })
		} catch (err) {
			console.error('Error deleting vacancyDB:', err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
)

export default router
