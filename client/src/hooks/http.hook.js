import {useCallback, useState} from 'react';
import {message} from "antd";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [ error, setError ] = useState(null);

    // Функция настройки запросов на сервер
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        if (method === 'DELETE') {
            setLoadingDelete(true);
        } else {
            setLoading(true);
        }

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

            setLoading(false);
            setLoadingDelete(false);

            return data;
        } catch (e) {
            setLoading(false);
            setLoadingDelete(false);
            setError(e.message);
            message.error(e.message);
            throw e;
        }
    }, []);

    const clearError = () => setError(null);

    return { request, loading, loadingDelete, error, clearError };
};