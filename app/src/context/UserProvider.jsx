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

                console.log(storedUserId);

                if (storedUserId) {
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

    // console.log(user);

    return <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>{children}</UserContext.Provider>;
}
