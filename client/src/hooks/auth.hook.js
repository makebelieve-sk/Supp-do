// Хук, отвечающий за регистрацию/вход/выход и запись пользователя в хранилище и куки
import {useState, useEffect, useCallback} from "react";
import Cookies from "js-cookie";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {setValueToCookies} from "../helpers/functions/general.functions/workWithCookies";

const storageName = "user";   // Название объекта пользователя в локальном хранилище браузера
const jwt = "token";   // Название поля в куки для сохранения токена пользователя
const pageSize = "pageSize";   // Название поля в куки для сохранения количества записей на странице таблицы

// Значения куки по умолчанию
const pageSizeDefault = 10;

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Функция входа в систему
    const login = useCallback((token, user) => {
        // Добавляем данные о пользователе в хранилище браузера
        localStorage.setItem(storageName, JSON.stringify({token, user}));

        Cookies.set(jwt, token);    // Записываем токен в куки

        // Обновляем состояние токена, устанавливаем Cookies.get(jwt), чтобы запросы на сервер шли с токеном
        setToken(Cookies.get(jwt));
        setUser(user);  // Обновляем состояние объекта пользователя

        // Сохраняем пользователя в хранилище
        store.dispatch(ActionCreator.ActionCreatorAuth.setUser(user));

        // Устанавливаем в куки и в редакс значения количества записей на странице таблицы и количество колонок
        setValueToCookies(pageSize, pageSizeDefault, ActionCreator.ActionCreatorMain.setPageSize);
    }, []);

    // Функция выхода
    const logout = useCallback(() => {
        // Удаляем данные о входе пользователя
        setToken(null);
        setUser(null);

        // Очищаем локальное хранилище браузера
        localStorage.removeItem(storageName);

        // Очищаем куки
        Cookies.remove(jwt);

        // Очищаем редакс
        store.dispatch({type: "USER_LOGOUT", payload: undefined});
    }, []);

    // Происходит вызов функции входа с уже полученными параметрами из хранилища браузера
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        data && data.token ? login(data.token, data.user) : logout();
    }, [login, logout]);

    return {login, logout, token, user};
}