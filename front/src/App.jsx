import { useEffect, useState } from 'react'
import './styles/App.scss'
import { getData } from './DonneeAPI/sportseeApi.jsx'
import Resultat from './Resultat.jsx'

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



	//!Gestion logique record objectifs
	const activitySessions = data.activity.sessions;

	let beatRecordCalories = false;

	if (activitySessions.length >= 2) {
		const lastCal = activitySessions[activitySessions.length - 1].calories;
		const prevCal = activitySessions[activitySessions.length - 2].calories;
		beatRecordCalories = lastCal > prevCal;
	}

	const beatRecord = beatRecordCalories;
	console.log(`Calories: ${activitySessions.at(-1)?.calories} > ${activitySessions.at(-2)?.calories} ? ${beatRecordCalories}`);


	return <div className="App">

		<h1>Bonjour <strong>{data.main.userInfos.firstName}</strong></h1>
        
		{beatRecord && (
			<p className="congrats-banner">Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
		)}

		<Resultat data={data} />
		</div>
}


export default App