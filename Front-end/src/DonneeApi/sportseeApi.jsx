import * as Data from '../../../Back-end/app/data.js'

export function getData(userId) {
  const main = Data.USER_MAIN_DATA.find(user => user.id === userId)
  const activity = Data.USER_ACTIVITY.find(kiloCal => kiloCal.userId === userId)
  const average = Data.USER_AVERAGE_SESSIONS.find(session => session.userId === userId)
  const performance = Data.USER_PERFORMANCE.find(kindata => kindata.userId === userId)

  if (!main || !activity || !average || !performance) {
    throw new Error('Données utilisateur introuvables')
  }

  //!Type de score
  const score = main.todayScore ?? main.score

  return {
    main: {
      ...main,
      todayScore: score
    },
    activity,
    averageSessions: average,
    performance
  }
}

export function getUserData(userId) {
  const main = Data.USER_MAIN_DATA.find(user => user.id === userId)
  if (!main) {
    throw new Error('Données utilisateur introuvables')
  }
  const score = main.todayScore ?? main.score
  return {
    ...main,
    todayScore: score
  }
}
  
