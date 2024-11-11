import { auth } from '../../firebase.config';
import dbApi from './dbApi';

const authApi = {
    async login(email, password) {
        try {
            console.log('login...');
            const userCredential = await auth.signInWithEmailAndPassword(email, password);

            const user = await dbApi.getUserData(userCredential.user.uid);

            console.log('successed');
            return {
                userId: userCredential.user.uid,
                ...user,
            };
        } catch (error) {
            throw error;
        }
    },

    async register(email, password) {
        try {
            console.log('creating user...');
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);

            console.log('adding user to db...');

            await dbApi.addNewUserToDb(userCredential.user.uid, email);
            const user = await dbApi.getUserData(userCredential.user.uid);

            console.log('successed');
            return user;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await auth.signOut();
            console.log('Sign-out successful.');
        } catch (error) {
            throw error;
        }
    },
};

export default authApi;
