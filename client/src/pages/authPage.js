// Страница авторизации
import React, {useState} from "react";

import {AuthComponent} from "../components/auth.components/auth";
import {RegistrationComponent} from "../components/auth.components/reg";
import {ChangePasswordComponent} from "../tabs/changePassword";

export const AuthPage = () => {
    // Создание стейта для показа формы регистрации и смены пароля
    const [regForm, setRegForm] = useState(false);
    const [changePass, setChangePass] = useState(false);

    let component = <AuthComponent setRegForm={setRegForm} setChangePass={setChangePass} />;

    if (regForm) {
        component = <RegistrationComponent />;
    } else if (changePass) {
        component = <ChangePasswordComponent />
    }

    return component;
}