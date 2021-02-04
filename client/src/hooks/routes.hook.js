import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {MainPage} from "../components/pages/mainPage";
import {AuthPage} from "../components/pages/authPage";
import {RegistrationComponent} from "../components/authComponents/regComponent";
import {ChangePasswordComponent} from "../components/authComponents/changePassword";

export const useRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/authorization">
                <AuthPage/>
            </Route>
            <Route path="/registration">
                <RegistrationComponent/>
            </Route>
            <Route path="/change-password">
                <ChangePasswordComponent/>
            </Route>
            <Redirect to="/authorization"/>
        </Switch>
    )
}