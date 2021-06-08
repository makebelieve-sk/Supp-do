// Главный файл фронтенда
import React, {useEffect} from "react";
import moment from "moment";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import "moment/locale/ru";

import {useRoutes} from "./hooks/routes.hook";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import store from "./redux/store";
import {LogDORoute} from "./routes/route.LogDO";
import ErrorBoundaryPage from "./pages/errorBoundaryPage";
import {request} from "./helpers/functions/general.functions/request.helper";
import TabOptions from "./options/tab.options/record.options";

import "./App.css";

export default function App() {
    // Определяем контексту начальные значения, полученные из хука useAuth
    const {login, logout, token, user} = useAuth();

    // Каждый день в 00:10 обновляем даты у записей ЖДО
    useEffect(() => {
        setInterval(async () => {
            if (moment().hours() === 0 && moment().minutes() === 10 && moment().seconds() === 0) {
                await LogDORoute.update(moment().format(TabOptions.dateFormat).valueOf());
            }
        }, 1000);
    }, []);

    // Запрашиваем файл настроек приложения
    useEffect(() => {
        const getConfig = async () => {
            const config = await request("/main/config");

            // Устанавливаем в хранилище браузера режим работы приложения
            if (config.mode) localStorage.setItem("mode", JSON.stringify(config.mode));
        }

        getConfig().then(null);
    }, [logout]);

    // Инициализируем флаг авторизации
    const isAuthenticated = !!token;

    // Определяем роутинг приложения
    const routes = useRoutes(isAuthenticated);

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
