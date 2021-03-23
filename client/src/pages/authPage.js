import React, {useState} from "react";

import {AuthComponent} from "../components/auth.components/auth/auth.component";
import {RegistrationComponent} from "../components/auth.components/reg/reg.component";
import {ChangePasswordComponent} from "../components/auth.components/changePassword/changePassword.component";

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