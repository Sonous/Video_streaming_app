import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
    const [user, setUser] = useState({});
    const [isAuth, setAuth] = useState(false);

    return <UserContext.Provider value={{ user, setUser, isAuth, setAuth }}>{children}</UserContext.Provider>;
}
