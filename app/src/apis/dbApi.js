import firebase, { db } from '../../firebase.config';
import { generateRandomString } from '../utils';

const dbApi = {
    async getUserData(uid) {
        try {
            console.log('get user data...');
            const user = await db.collection('users').doc(uid).get();

            if (user.exists) {
                return {
                    userId: uid,
                    ...user.data(),
                };
            } else {
                console.log('No such document!');
                return null;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async addNewUserToDb(uid, email = '', phone = '', profilePicture = '', displayName = '') {
        try {
            await db
                .collection('users')
                .doc(uid)
                .set({
                    username: displayName || generateRandomString(),
                    email,
                    profilePicture,
                    bio: '',
                    phone,
                    followers: [],
                    following: [],
                    isActive: true,
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

    async getUserByName(name, userId) {
        try {
            const results = await db.collection('users').get();

            const users = results.docs.reduce((list, doc) => {
                const username = doc.data().username.toLowerCase();
                const accountName = doc.data().name.toLowerCase();

                if (
                    name &&
                    doc.id !== userId &&
                    (username.includes(name.toLowerCase()) || accountName.includes(name.toLowerCase()))
                ) {
                    list.push({
                        userId: doc.id,
                        ...doc.data(),
                    });
                }
                return list;
            }, []);

            return users;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async makeChatRoom(roomId, userId, friendId) {
        try {
            const room = await db.collection('rooms').doc(roomId).get();
            if (room.exists) {
                return;
            }

            await db
                .collection('rooms')
                .doc(roomId)
                .set({
                    participants: [userId, friendId],
                    lastMessage: {},
                    createAt: new Date(),
                    updatedAt: new Date(),
                    chatType: 'private',
                });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async updateChatRoom(roomId, updateInfo) {
        try {
            await db.collection('rooms').doc(roomId).update(updateInfo);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async sendMessage(roomId, senderId, content, type, attachmentUrl) {
        try {
            await db.collection('messages').add({
                roomId,
                senderId,
                content,
                attachmentUrl,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                isRead: false,
                type,
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async deleteMessage(messageId, roomId) {
        try {
            await db.collection('messages').doc(messageId).delete();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};

export default dbApi;
