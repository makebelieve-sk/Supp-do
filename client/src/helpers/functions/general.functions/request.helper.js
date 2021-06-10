// Создание запроса
import {message} from "antd";
import {StorageVars} from "../../../options/global.options";

export const request = async (url, method = "GET", body = null, headers = {}) => {
    try {
        if (body) {
            body = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
            headers["Access-Control-Allow-Credentials"] = true;
        }

        const response = await fetch(url, {method, body, headers});
        const data = await response.json();

        if (response.status === 400) {
            console.log(data.message);
            message.error(data.message);
            return data && data.errors && data.errors.length ? data : null;
        }

        if (response.status === 401) {
            // Удаляем все данные пользователя из хранилища браузера
            await localStorage.removeItem(StorageVars.user);

            message.error(data.message);

            window.location.replace("/login");  // Перенаправляем пользователя на страницу входа

            return null;
        }

        if (response.status === 404) {
            console.log(data.message);
            message.error(data.message);
            return data.message;
        }

        if (!response.ok) {
            if (data.errors) {
                console.log("1: ", data.errors)
                throw new Error(data.errors[0].msg || "Что-то пошло не так");
            } else {
                throw new Error(data.message || "Что-то пошло не так");
            }
        }

        return data;
    } catch (e) {
        console.log(e.message);
        throw new Error(e.message);
    }
};