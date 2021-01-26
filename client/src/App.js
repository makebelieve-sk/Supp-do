import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import './App.css';

import {useRoutes} from './hooks/routes.hook';
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/authContext";

export const App = () => {
    const {login, logout, token, userId} = useAuth();
    const isAuthenticated = !!token;
    const routes = useRoutes(isAuthenticated);

    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated
        }}>
            <Router>
                {routes}
            </Router>
        </AuthContext.Provider>
    )
};
