const API_BASE_URL = import.meta.env.VITE_API_URL || '/'

async function fetchEndpoint(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  
  if (!response.ok) {
    throw new Error(`Erreur API (${response.status}) sur ${path}`)

  }

  const payload = await response.json()
  return payload.data
}

export async function getDataAPI(userId) {
  const id = Number(userId)

  const [main, activity, averageSessions, performance] = await Promise.all([
    fetchEndpoint(`user/${id}`),
    fetchEndpoint(`user/${id}/activity`),
    fetchEndpoint(`user/${id}/average-sessions`),
    fetchEndpoint(`user/${id}/performance`)
  ])

  const score = main.todayScore ?? main.score

  return {
    main: {
      ...main,
      todayScore: score
    },
    activity,
    averageSessions,
    performance
  }
}