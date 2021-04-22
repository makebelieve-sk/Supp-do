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
    const login = useCallback(async (jwtToken, id, user) => {
        try {
            setToken(jwtToken);
            setUserId(id);
            setUser(user);

            // Добавляем данные о пользователе в хранилище браузера
            await localStorage.setItem(storageName, JSON.stringify({
                userId: id, token: jwtToken, user: user
            }));

            // Сохраняем пользователя в хранилище
            store.dispatch(ActionCreator.ActionCreatorAuth.setUser(user));
        } catch (err) {
            console.log(err);
            message.error(err.message);
            throw new Error(err);
        }
    }, []);

    // Функция выхода
    const logout = useCallback(async () => {
        try {
            setToken(null);
            setUserId(null);
            setUser(null);

            // Удаляем все данные пользователя из хранилища браузера
            await localStorage.removeItem(storageName);

            // Удаляем пользователя из хранилища
            store.dispatch(ActionCreator.ActionCreatorAuth.setUser(null));
        } catch (err) {
            console.log(err);
            message.error(err.message);
            throw new Error(err);
        }
    }, []);

    // Происходит вызов функции входа с уже полученными параметрами из хранилища браузера
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.token) login(data.token, data.userId, data.user);
    }, [login]);

    return {login, logout, token, userId, user};
}