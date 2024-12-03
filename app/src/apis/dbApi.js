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
                likes: [],
                comments: [],
                marks: [],
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

    async getAllVideos() {
        try {
            const videos = await db.collection('videos').get();

            const fullVideosInfo = await Promise.all(
                videos.docs.map(async (video) => {
                    const videoOwner = await this.getUserData(video.data().userId);

                    return {
                        ...video.data(),
                        videoId: video.id,
                        videoOwner,
                        isPlayVideo: 'stop',
                    };
                }),
            );

            return fullVideosInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async updateVideo(videoId, updateInfo) {
        try {
            await db.collection('videos').doc(videoId).update(updateInfo);
        } catch (error) {
            console.error('update video error: ', error);
            throw error;
        }
    },

    async addLikeToVideo(videoId, userId) {
        try {
            console.log('add like to video...');

            const video = await db.collection('videos').doc(videoId).get();

            const isExisted = video.data().likes.includes(userId);

            if (!isExisted) {
                await this.updateVideo(videoId, { likes: [...video.data().likes, userId] });
            } else {
                await this.updateVideo(videoId, { likes: video.data().likes.filter((id) => id !== userId) });
            }

            console.log('complete');
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async addMarkToVideo(videoId, userId) {
        try {
            console.log('add mark to video...');

            const video = await db.collection('videos').doc(videoId).get();

            const isExisted = video.data().marks.includes(userId);

            if (!isExisted) {
                await this.updateVideo(videoId, { marks: [...video.data().marks, userId] });
            } else {
                await this.updateVideo(videoId, { marks: video.data().likes.filter((id) => id !== userId) });
            }

            console.log('complete');
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async addCommentToVideo(
        comments,
        videoId,
        userId,
        content,
        parentCommentId = null,
        repliedCommentId = null,
        subCommentIds = [],
    ) {
        try {
            const comment = await db.collection('comments').add({
                videoId,
                userId,
                content,
                likesCount: 0,
                dislikesCount: 0,
                parentCommentId,
                subCommentIds,
                repliedCommentId,
                createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            });

            await this.updateVideo(videoId, {
                comments: [
                    ...comments,
                    {
                        commentId: comment.id,
                        parentCommentId,
                    },
                ],
            });
            return comment.id;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getAllInfoOfCommentById(commentId) {
        try {
            const comment = await db.collection('comments').doc(commentId).get();

            const commentOwner = await db.collection('users').doc(comment.data().userId).get();

            return {
                ...comment.data(),
                commentId: comment.id,
                commentOwner: commentOwner.data(),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async getOnlyCommentById(commentId) {
        try {
            const comment = await db.collection('comments').doc(commentId).get();

            return {
                ...comment.data(),
                commentId: comment.id,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async updateCommentById(commentId, updateInfo) {
        try {
            await db.collection('comments').doc(commentId).update(updateInfo);
        } catch (error) {
            console.error('update comment error: ', error);
            throw error;
        }
    },

    async deleteCommentById(commentId, videoId, parentCommentId) {
        try {
            if (!parentCommentId) {
                const querySnapshot = await db.collection('comments').where('parentCommentId', '==', commentId).get();

                const batch = db.batch();

                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                await batch.commit();
            }

            await db.collection('comments').doc(commentId).delete();
            const video = await db.collection('videos').doc(videoId).get();

            await this.updateVideo(videoId, {
                comments: video.data().comments.filter((comment) => comment.commentId !== commentId),
            });
        } catch (error) {
            console.error('delete comment error: ', error);
            throw error;
        }
    },
};

export default dbApi;
