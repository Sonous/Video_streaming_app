import firebase, { auth } from '../../firebase.config';
import dbApi from './dbApi';

const authApi = {
    async login(email, password) {
        try {
            console.log('login...');
            const userCredential = await auth.signInWithEmailAndPassword(email, password);

            await dbApi.updateUserInfo(userCredential.user.uid, {
                isActive: true,
            });
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

    async logout(userId) {
        try {
            console.log(userId);
            await dbApi.updateUserInfo(userId, {
                isActive: false,
            });

            await auth.signOut();
            console.log('Sign-out successful.');
        } catch (error) {
            throw error;
        }
    },

    async loginWithGithubAccount(access_token) {
        try {
            const credential = firebase.auth.GithubAuthProvider.credential(access_token);

            console.log('start sign in with firebase');

            const data = await auth.signInWithCredential(credential);

            if (data.additionalUserInfo.isNewUser) {
                await dbApi.addNewUserToDb(data.user.uid, data.user.email, data.user.photoURL, data.user.displayName);
            }

            await dbApi.updateUserInfo(data.user.uid, {
                isActive: true,
            });

            const user = await dbApi.getUserData(data.user.uid);

            console.log('success');

            return {
                userId: data.user.uid,
                ...user,
            };
        } catch (error) {
            throw error;
        }
    },
};

export default authApi;
