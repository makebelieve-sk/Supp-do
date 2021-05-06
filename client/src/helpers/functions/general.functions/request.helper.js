// Создание запроса
import {message} from "antd";

export const request = async (url, method = "GET", body = null, headers = {}) => {
    try {
        if (body) {
            body = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
            headers["Access-Control-Allow-Credentials"] = true;
        }

        const response = await fetch(url, {method, body, headers});
        const data = await response.json();

        if (response.status === 401) {
            // Удаляем все данные пользователя из хранилища браузера
            await localStorage.removeItem("user");

            message.error();

            return window.location.replace("/login");  // Перенаправляем пользоавтеля на страницу входа
        }

        if (!response.ok) {
            if (data.errors) {
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