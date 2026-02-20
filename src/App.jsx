import { useEffect, useState } from 'react'
import './styles/App.scss'
import { getUserBundle } from './services/sportseeApi'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const bundle = await getUserBundle(12)
        setData(bundle)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <main className="app">Chargement des données SportSee...</main>
  }

  if (error) {
    return <main className="app app--error">{error}</main>
  }

  if (!data) {
    return <main className="app app--error">Aucune donnée disponible.</main>
  }

  const score = Math.round((data.main.todayScore ?? data.main.score ?? 0) * 100)

  return (
    <main className="app">
      <h1>SportSee</h1>
      <p>
        Bonjour <strong>{data.main.userInfos.firstName}</strong>
      </p>
      <section className="app__grid">
        <article>
          <h2>Score du jour</h2>
          <p>{score}%</p>
        </article>
        <article>
          <h2>Activité (sessions)</h2>
          <p>{data.activity.sessions.length}</p>
        </article>
        <article>
          <h2>Sessions moyennes</h2>
          <p>{data.averageSessions.sessions.length}</p>
        </article>
        <article>
          <h2>Performances</h2>
          <p>{data.performance.data.length}</p>
        </article>
      </section>
    </main>
  )
}

export default App
