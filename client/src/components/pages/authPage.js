import React, {useState} from 'react';

import {AuthComponent} from "../authComponents/authComponent";
import {RegistrationComponent} from "../authComponents/regComponent";
import {ChangePasswordComponent} from "../authComponents/changePassword";

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