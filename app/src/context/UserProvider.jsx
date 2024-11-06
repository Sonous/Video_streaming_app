import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    console.log(user);

    return <UserContext.Provider value={{ user, setUser, isAuth, setIsAuth }}>{children}</UserContext.Provider>;
}
