import {message} from "antd";

// Функция настройки запросов на сервер
export const request = async (url, method = 'GET', body = null, headers = {}) => {
    try {
        if (body) {
            body = JSON.stringify(body);
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {method, body, headers});
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Что-то пошло не так');
        }

        return data;
    } catch (e) {
        message.error(e.message);
        throw e;
    }
};