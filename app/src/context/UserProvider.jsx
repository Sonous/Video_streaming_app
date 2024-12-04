import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from '../../firebase.config';

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [replyCommentId, setReplyCommentId] = useState(null);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        if (uid) {
            const unsubscribe = db
                .collection('users')
                .doc(uid)
                .onSnapshot((snapshot) => {
                    if (snapshot.exists) {
                        const newUserInfo = {
                            userId: snapshot.id,
                            ...snapshot.data(),
                        };
                        console.log('do work...');

                        setUser(newUserInfo);
                    }
                });

            return unsubscribe;
        }
    }, [uid]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((credential) => {
            if (credential) {
                setUid(credential.uid);
                setIsAuth(true);
            } else {
                setUid(null);
                setIsAuth(false);
            }
        });

        return unsubscribe; // Hủy đăng ký khi component unmount
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth, replyCommentId, setReplyCommentId }}>
            {children}
        </UserContext.Provider>
    );
}
