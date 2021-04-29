// Создание констекста авторизации
import {createContext} from "react";

const noop = () => {};

export const AuthContext = createContext({
    token: null,
    user: null,
    login: noop,
    logout: noop,
    isAuthenticated: false,
});