import {useState, useEffect, useCallback} from 'react';

const storageName = 'userId';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);

    const login = useCallback((jwtToken, id, user) => {
        setToken(jwtToken);
        setUserId(id);
        setUser(user);

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, user: user
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUser(null);

        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.token) {
            login(data.token, data.userId, data.user);
        }
    }, [login]);

    return { login, logout, token, userId, user };
}