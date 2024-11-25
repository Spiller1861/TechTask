import React, { useState, useEffect } from 'react'
import ModalForm from './components/ModalForm'

interface Vacancy {
	id: string
	company: string
	vacancy: string
	salaryRange: string
	status: string
	note: string
}

const API_URL = 'https://testtask-production.up.railway.app/api/vacancydbs'

const App: React.FC = () => {
	const [vacancies, setVacancies] = useState<Vacancy[]>([])
	const [showModal, setShowModal] = useState(false)
	const [currentVacancy, setCurrentVacancy] = useState<Vacancy | null>(null)

	const fetchVacancies = () => {
		fetch(API_URL)
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch vacancies')
				}
				return response.json()
			})
			.then(data => setVacancies(data))
			.catch(error => console.error('Error fetching vacancies:', error))
	}

	useEffect(() => {
		fetchVacancies()
	}, [])

	const handleSave = (vacancy: {
		company: string
		vacancy: string
		salaryRange: string
		status: string
		note: string
	}) => {
		if (currentVacancy) {
			fetch(`${API_URL}/${currentVacancy.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(vacancy),
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to update vacancy')
					}
					setVacancies(prev =>
						prev.map(vac =>
							vac.id === currentVacancy.id ? { ...vac, ...vacancy } : vac
						)
					)
					setShowModal(false)
					setCurrentVacancy(null)
				})
				.catch(error => console.error('Error updating vacancy:', error))
		} else {
			fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(vacancy),
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Failed to save vacancy')
					}
					return response.json()
				})
				.then(data => {
					setVacancies(prev => [...prev, { ...vacancy, id: data.id }])
					setShowModal(false)
				})
				.catch(error => console.error('Error saving vacancy:', error))
		}
	}

	const handleEdit = (vacancy: Vacancy) => {
		setCurrentVacancy(vacancy)
		setShowModal(true)
	}

	const handleDelete = (id: string) => {
		fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to delete vacancy')
				}
				setVacancies(prev => prev.filter(vac => vac.id !== id))
			})
			.catch(error => console.error('Error deleting vacancy:', error))
	}

	return (
		<div className='App'>
			<h1>Тестовое задание</h1>

			<button className='add-vacancy-button' onClick={() => setShowModal(true)}>
				+
			</button>

			{showModal && (
				<ModalForm
					onClose={() => {
						setShowModal(false)
						setCurrentVacancy(null)
					}}
					onSave={handleSave}
					initialData={currentVacancy || null}
				/>
			)}

			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Компания 🏢</th>
						<th>Вакансия 📋</th>
						<th>Зарплатная вилка 💸</th>
						<th>Статус отклика 📊</th>
						<th>Заметка 📝</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{vacancies.map(vac => (
						<tr key={vac.id}>
							<td>{vac.id}</td>
							<td>{vac.company}</td>
							<td>{vac.vacancy}</td>
							<td>{vac.salaryRange}</td>
							<td>{vac.status}</td>
							<td>{vac.note}</td>
							<td
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									paddingBottom: '20px',
									gap: '10px',
								}}
							>
								<button
									onClick={() => handleEdit(vac)}
									className='action-button'
								>
									Изменить
								</button>
								<button
									onClick={() => handleDelete(vac.id)}
									className='action-button'
								>
									Удалить
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default App
