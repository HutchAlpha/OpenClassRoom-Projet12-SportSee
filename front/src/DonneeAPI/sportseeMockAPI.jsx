import { USER_MAIN_DATA, USER_ACTIVITY, USER_AVERAGE_SESSIONS, USER_PERFORMANCE } from '../mockData.js';
import { UserModel } from './sportseeApi.jsx';

export async function getDataMock(userId) {
    const id = Number(userId);

    const main = USER_MAIN_DATA.find((u) => u.id === id);
    const activity = USER_ACTIVITY.find((u) => u.userId === id);
    const averageSessions = USER_AVERAGE_SESSIONS.find((u) => u.userId === id);
    const performance = USER_PERFORMANCE.find((u) => u.userId === id);

    if (!main || !activity || !averageSessions || !performance) {
        throw new Error(`Données mock introuvables pour l'utilisateur ${id}`);
    }

    return new UserModel({
        main,
        activity,
        averageSessions,
        performance
    });
}
