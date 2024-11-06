import { db } from '../../firebase.config';
import { generateRandomString } from '../utils';

const dbApi = {
    async getUserData(uid) {
        try {
            console.log('get user data...');
            const user = await db.collection('users').doc(uid).get();

            if (user.exists) {
                return user.data();
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (error) {
            throw error;
        }
    },

    async addNewUserToDb(uid, email) {
        try {
            await db.collection('users').doc(uid).set({
                username: generateRandomString(),
                email,
                profilePicture: '',
                bio: '',
                followers: [],
                following: [],
                likesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (error) {
            throw error;
        }
    },
};

export default dbApi;
