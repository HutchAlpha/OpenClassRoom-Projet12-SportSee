import {Data} from '/Back-end/app/data.js'

export async function getUserBundle(userId) {
  const main = USER_MAIN_DATA.find(user => user.id === userId)
  const activity = USER_ACTIVITY.find(a => a.userId === userId)
  const average = USER_AVERAGE_SESSIONS.find(s => s.userId === userId)
  const performance = USER_PERFORMANCE.find(p => p.userId === userId)

  if (!main || !activity || !average || !performance) {
    throw new Error('Données utilisateur introuvables')
  }

  return { main, activity, averageSessions: average, performance }
}