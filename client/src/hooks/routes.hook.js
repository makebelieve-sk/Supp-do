import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

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
                <Route path="/public/:fileName" render={() => {
                    // Меняем порт для корректной загрузки
                    window.location.port = 5000;
                    // Закрываем вкладку после 100мс
                    setTimeout(() => window.close(), 100);
                }}/>
                <Redirect to="/" exact/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/authorization" exact>
                <AuthPage/>
            </Route>
            <Route path="/registration" exact>
                <RegistrationComponent/>
            </Route>
            <Route path="/change-password" exact>
                <ChangePasswordComponent/>
            </Route>
            {/*<Redirect to="/authorization" exact/>*/}
        </Switch>
    )
}