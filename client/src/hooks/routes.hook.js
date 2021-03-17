// Хук, отвечающий за роутинг приложения
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
                <Route path="/" exact component={MainPage}/>
                <Route strict path="/public/" render={() => {
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
            <Route path="/login" component={AuthPage}/>
            <Route path="/register" component={RegistrationComponent}/>
            <Route path="/change-password" component={ChangePasswordComponent}/>
            {
                window.location.pathname === "/" ?
                    <Redirect to="/login"/> :
                    // TODO Написать страницу 404!!
                    <Route path="*" render={() => <div>Страница не найдена!</div>}/>
            }
        </Switch>
    )
}