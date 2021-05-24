// Методы модели "Смена пароля"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {NoticeError} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";

export const ChangePasswordRoute = {
    // Адрес для работы с разделом "Смена пароля"
    base_url: "/api/auth/changePassword/",
    // Сохранение записи помощи
    save: async function (item, setLoading) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            if (typeof data === "string") {
                // Останавливаем спиннер загрузки
                setLoading(false);

                return null;
            }

            // Выводим сообщение от сервера
            if (data) {
                message.success(data.message);

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("changePassword", "remove");
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorChangePassword.setErrorChangePassword("Возникла ошибка при изменении пароля: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
}