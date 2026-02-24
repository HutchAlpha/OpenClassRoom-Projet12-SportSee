const API_BASE_URL = 'http://localhost:3000'

const fetchJson = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Erreur API (${response.status}) sur ${path}`)
  }

  return response.json()
}

export const getUserBundle = async (userId) => {
  const [main, activity, averageSessions, performance] = await Promise.all([
    fetchJson(`/user/${userId}`),
    fetchJson(`/user/${userId}/activity`),
    fetchJson(`/user/${userId}/average-sessions`),
    fetchJson(`/user/${userId}/performance`),
  ])

  return {
    main: main.data,
    activity: activity.data,
    averageSessions: averageSessions.data,
    performance: performance.data,
  }
}
