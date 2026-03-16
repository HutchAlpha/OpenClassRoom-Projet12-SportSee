import { useEffect, useState } from 'react'
import './styles/App.scss'
import { getData } from './DonneeAPI/sportseeApi.jsx'
import Resultat from './Resultat.jsx'
import Activite from './Graph/Activite.jsx'
import Session from './Graph/Session.jsx'
import Objectif from './Graph/Objectif.jsx'
import Graph from './Graph/Graph.jsx'

function App() {
	const [data, setData] = useState(null)
	const [error, setError] = useState('')
	const [Id, setId] = useState(12);

	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await getData(Id)
				setData(response)
			} catch (err) {
				setError(err.message)
			}
		}

		loadData()
	}, [Id])

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

		<button className="BoutonId" onClick={() => setId(12)}>Karl (12)</button>
		<button className="BoutonId" onClick={() => setId(18)}>Cecilia (18)</button>

		<h1 className="MessageJoueur">Bonjour <span className="NomJoueur">{data.main.userInfos.firstName}</span></h1>
		{beatRecord && (
			<p className="Felicitation">Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
		)}
		<div className='BlockCentral'>		
			<div className='DCanvas'>
				<Activite data={data} />
				<Session data={data} />
				<Graph data={data} />
				<Objectif data={data} />
			</div>
			<div className='Resultat'>
				<Resultat data={data} />
			</div>	
		</div>	
	</div>
}


export default App