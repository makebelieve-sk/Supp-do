import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import "moment/locale/ru";

import {useRoutes} from "./hooks/routes.hook";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/authContext";
import store from "./redux/store";

import "./App.css";

export default function App() {
    // Определяем контексту начальные значения, полученные из хука useAuth
    const {login, logout, token, userId, user} = useAuth();
    // Инициализируем флаг авторизации
    const isAuthenticated = !!token;
    // Определяем роутинг приложения
    const routes = useRoutes(isAuthenticated);

    return (
        <Provider store={store}>
            <ConfigProvider locale={ruRU}>
                <AuthContext.Provider value={{
                    token, login, logout, userId, isAuthenticated, user
                }}>
                    <Router>
                        {routes}
                    </Router>
                </AuthContext.Provider>
            </ConfigProvider>
        </Provider>
    )
};
