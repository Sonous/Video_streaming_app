import React, { createContext, useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dbApi from '../apis/dbApi';

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');

                if (storedUserId) {
                    await dbApi.updateUserInfo(storedUserId, {
                        isActive: true,
                    });
                    const userInfo = await dbApi.getUserData(storedUserId);

                    setUser({
                        userId: storedUserId,
                        ...userInfo,
                    });
                    setIsAuth(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkUser();
    }, []);

    useEffect(() => {
        const unsubscribe = db
            .collection('users')
            .doc(user?.userId)
            .onSnapshot((snapshot) => {
                if (snapshot.exists) {
                    const newUserInfo = {
                        userId: snapshot.id,
                        ...snapshot.data(),
                    };
                    console.log('jifdsji');
                    console.log('do work...');

                    setUser(newUserInfo);
                }
            });

        return () => {
            unsubscribe();
        };
    }, []);

    console.log(user);

    return <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>{children}</UserContext.Provider>;
}
