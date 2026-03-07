import { useEffect, useState } from 'react'
import './styles/App.scss'
import { getData } from './DonneeAPI/sportseeapi.jsx'

function App() {
	const [data, setData] = useState(null)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await getData(12)
				setData(response)
			} catch (err) {
				setError(err.message)
			}
		}

		loadData()
	}, [])

	if (error) {
		return <div>Erreur: {error}</div>
	}

	if (!data) {
		return <div>Chargement des données en cours...</div>
	}

	return <div>Bonjour <strong>{data.main.userInfos.firstName}</strong></div>
}


export default App