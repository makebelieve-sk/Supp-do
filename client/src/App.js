// Главный файл фронтенда
import React, {useEffect, useState} from "react";
import moment from "moment";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {ConfigProvider, message, Spin, Row, Col} from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import "moment/locale/ru";

import {useRoutes} from "./hooks/routes.hook";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import store from "./redux/store";
import ErrorBoundaryPage from "./pages/errorBoundaryPage";
import {request} from "./helpers/functions/general.functions/request.helper";

import "./App.css";

/**
 * Функция получения файла настроек проекта
 * @param setLoading - функция управления состоянием показа спиннера загрузки
 * @param logout - функция выхода пользоавтеля из системы
 * @returns {Promise<void>} - сохраняем объект настроек приложения в локальном хранилище браузера
 */
const getConfig = async (setLoading, logout) => {
    const config = await request("/main/config");

    // Устанавливаем в хранилище браузера файл настроек проекта
    if (config) {
        localStorage.setItem("config", JSON.stringify(config));

        const {mode, timeToUpdateDates} = config;

        console.log("Режим приложения: ", mode);

        if (mode && mode === "demo") {
            const hours = +timeToUpdateDates.split(":")[0];
            const minutes = +timeToUpdateDates.split(":")[1];
            const seconds = +timeToUpdateDates.split(":")[2];

            setInterval(async () => {
                if (moment().hours() === hours && moment().minutes() === minutes && moment().seconds() === seconds) {
                    message.success("Даты записей успешно обновлены");

                    logout();   // Выходим на страницу login
                }
            }, 1000);
        }
    }

    setLoading(false);
}

export default function App() {
    // Инициализация показа спиннера загрузки приложения
    const [loading, setLoading] = useState(true);

    // Определяем контексту начальные значения, полученные из хука useAuth
    const {login, logout, token, user} = useAuth();

    // Получаем файл настроек приложения и выходим из приложения, если даты записей обновились
    useEffect(() => {
        getConfig(setLoading, logout).then(null);
    }, [logout]);

    // Инициализируем флаг авторизации
    const isAuthenticated = !!token;

    // Определяем роутинг приложения
    const routes = useRoutes(isAuthenticated);

    if (loading) {
        return <Row justify="space-around" align="middle" style={{height: "100vh"}}><Col><Spin size="large" /></Col></Row>;
    }

    return (
        <ErrorBoundaryPage>
            <Provider store={store}>
                <ConfigProvider locale={ruRU}>
                    <AuthContext.Provider value={{token, login, logout, isAuthenticated, user}}>
                        <Router>
                            {routes}
                        </Router>
                    </AuthContext.Provider>
                </ConfigProvider>
            </Provider>
        </ErrorBoundaryPage>
    )
};
