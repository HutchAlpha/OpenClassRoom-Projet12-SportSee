const API_BASE_URL = '/'

async function fetchEndpoint(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  
  if (!response.ok) {
    throw new Error(`Erreur API (${response.status}) sur ${path}`)

  }

  const payload = await response.json()
  return payload.data
}

export class UserModel {
  constructor({ main, activity, averageSessions, performance }) {
    this.id = main.id
    this.userInfos = main.userInfos
    this.score = main.todayScore ?? main.score 
    this.keyData = main.keyData

    this.activity = activity.sessions

    this.averageSessions = averageSessions.sessions

    this.performance = {
      kind: performance.kind,
      data: performance.data
    }
  }
}

export async function getDataAPI(userId) {
  const id = Number(userId)

  const [main, activity, averageSessions, performance] = await Promise.all([
    fetchEndpoint(`user/${id}`),
    fetchEndpoint(`user/${id}/activity`),
    fetchEndpoint(`user/${id}/average-sessions`),
    fetchEndpoint(`user/${id}/performance`)
  ])

  return new UserModel({
      main,
      activity,
      averageSessions,
      performance
  })
}