// Хук, отвечающий за регистрацию/вход/выход и запись пользвотеля в хранилища
import {useState, useEffect, useCallback} from "react";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";

const storageName = "userId";   // Название объект пользователя в локальном хранилище браузера

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);

    // Функция входа в систему
    const login = useCallback((jwtToken, id, user) => {
        setToken(jwtToken);
        setUserId(id);
        setUser(user);

        // Добавляем данные о пользователе в хранилище браузера
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, user: user
        }));

        // Сохраняем пользователя в хранилище
        store.dispatch(ActionCreator.ActionCreatorAuth.setUser(user));
    }, []);

    // Функция выхода
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUser(null);

        // Удаляем все данные пользователя из хранилища браузера
        localStorage.removeItem(storageName);

        // Удаляем пользователя из хранилища
        store.dispatch(ActionCreator.ActionCreatorAuth.setUser(null));
    }, []);

    // Происходит вызов функции входа с уже полученными параметрами из хранилища браузера
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.token) login(data.token, data.userId, data.user);
    }, [login]);

    return {login, logout, token, userId, user};
}