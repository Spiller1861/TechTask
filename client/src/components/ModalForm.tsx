import React, { useState, useEffect } from 'react'

interface ModalFormProps {
	onClose: () => void
	onSave: (vacancy: {
		company: string
		vacancy: string
		salaryRange: string
		status: string
		note: string
	}) => void
	initialData: {
		company: string
		vacancy: string
		salaryRange: string
		status: string
		note: string
	} | null
}

const ModalForm: React.FC<ModalFormProps> = ({
	onClose,
	onSave,
	initialData,
}) => {
	const [company, setCompany] = useState('')
	const [vacancy, setVacancy] = useState('')
	const [minSalary, setMinSalary] = useState('')
	const [maxSalary, setMaxSalary] = useState('')
	const [status, setStatus] = useState('')
	const [note, setNote] = useState('')
	const [errors, setErrors] = useState<any>({})

	useEffect(() => {
		if (initialData) {
			setCompany(initialData.company)
			setVacancy(initialData.vacancy)

			const salaryMatch = initialData.salaryRange.match(
				/^(\d+)\s*-\s*(\d+)\s*\$$/
			)
			if (salaryMatch) {
				setMinSalary(salaryMatch[1])
				setMaxSalary(salaryMatch[2])
			}

			setStatus(initialData.status)
			setNote(initialData.note)
		}
	}, [initialData])

	const validateForm = () => {
		const newErrors: any = {}

		if (!company) newErrors.company = 'Заполните поле "Компания"'
		if (!vacancy) newErrors.vacancy = 'Заполните поле "Вакансия"'
		if (!minSalary || !maxSalary)
			newErrors.salaryRange = 'Заполните поле "Зарплатная вилка"'
		if (!status) newErrors.status = 'Заполните поле "Статус отклика"'
		if (!note) newErrors.note = 'Заполните поле "Заметка"'

		if (minSalary && maxSalary) {
			const min = parseFloat(minSalary)
			const max = parseFloat(maxSalary)

			if (min < 0 || max < 0) {
				newErrors.salaryRange = 'Зарплатная вилка не может быть отрицательной'
			} else if (min > max) {
				newErrors.salaryRange =
					'Минимальное значение не может быть больше максимального'
			}
		}

		if (/^\d+$/.test(company)) {
			newErrors.company = 'Название компании не может состоять только из цифр'
		}
		if (/^\d+$/.test(vacancy)) {
			newErrors.vacancy = 'Название вакансии не может состоять только из цифр'
		}
		if (!['Есть отклик', 'Нет отклика'].includes(status)) {
			newErrors.status =
				'Статус должен быть либо "Откликнут" или "Не откликнут"'
		}

		return newErrors
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors = validateForm()
		setErrors(newErrors)

		if (Object.keys(newErrors).length === 0) {
			const salaryRange = `${minSalary} - ${maxSalary} $`
			onSave({ company, vacancy, salaryRange, status, note })
		}
	}

	const handleBackgroundClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return (
		<div className='modal-overlay' onClick={handleBackgroundClick}>
			<div className='modal'>
				<span className='close' onClick={onClose}>
					&times;
				</span>
				<h2>{initialData ? 'Изменить Вакансию' : 'Новая Вакансия'}</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Компания</label>
						<input
							type='text'
							value={company}
							onChange={e => setCompany(e.target.value)}
						/>
						{errors.company && <p className='error'>{errors.company}</p>}
					</div>
					<div>
						<label>Вакансия</label>
						<input
							type='text'
							value={vacancy}
							onChange={e => setVacancy(e.target.value)}
						/>
						{errors.vacancy && <p className='error'>{errors.vacancy}</p>}
					</div>
					<div>
						<label>Зарплатная вилка</label>
						<div style={{ display: 'flex', gap: '10px' }}>
							<input
								type='number'
								value={minSalary}
								onChange={e => setMinSalary(e.target.value)}
							/>
							<input
								type='number'
								value={maxSalary}
								onChange={e => setMaxSalary(e.target.value)}
							/>
						</div>
						{errors.salaryRange && (
							<p className='error'>{errors.salaryRange}</p>
						)}
					</div>
					<div>
						<label>Статус отклика</label>
						<div className='status-group'>
							<label>
								<input
									type='radio'
									name='status'
									value='Есть отклик'
									checked={status === 'Есть отклик'}
									onChange={() => setStatus('Есть отклик')}
								/>
								Есть отклик
							</label>
							<label>
								<input
									type='radio'
									name='status'
									value='Нет отклика'
									checked={status === 'Нет отклика'}
									onChange={() => setStatus('Нет отклика')}
								/>
								Нет отклика
							</label>
						</div>
						{errors.status && <p className='error'>{errors.status}</p>}
					</div>
					<div>
						<label>Заметка</label>
						<input
							type='text'
							value={note}
							onChange={e => setNote(e.target.value)}
						/>
						{errors.note && <p className='error'>{errors.note}</p>}
					</div>
					<button
						style={{ height: '50px', borderRadius: '10px' }}
						type='submit'
					>
						Сохранить
					</button>
				</form>
			</div>
		</div>
	)
}

export default ModalForm
