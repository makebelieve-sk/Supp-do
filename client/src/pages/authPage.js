// Страница авторизации
import React, {useState} from "react";

import {AuthComponent} from "../components/auth.components/auth";
import {RegistrationComponent} from "../components/auth.components/reg";

export const AuthPage = () => {
    // Создание стейта для показа формы регистрации и смены пароля
    const [regForm, setRegForm] = useState(false);

    let component = <AuthComponent setRegForm={setRegForm} />;

    if (regForm) component = <RegistrationComponent />;

    return component;
}