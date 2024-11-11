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

    async saveVideoInfo(userId, videoUrl, thumbnailUrl, description) {
        try {
            const video = await db.collection('videos').add({
                userId,
                videoUrl,
                thumbnailUrl,
                description,
                tags: [],
                likesCount: 0,
                commentsCount: 0,
                marksCount: 0,
                viewersCount: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return video;
        } catch (error) {
            throw error;
        }
    },

    async updateUserInfo(userId, newData) {
        try {
            console.log('updating...');
            await db.collection('users').doc(userId).update(newData);

            console.log('conplete');
        } catch (error) {
            throw error;
        }
    },
};

export default dbApi;
