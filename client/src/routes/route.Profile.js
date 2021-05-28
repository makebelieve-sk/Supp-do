// Методы модели "Профиль"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {NoticeError} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";

export const ProfileRoute = {
    // Адрес для работы с разделом "Профиль"
    base_url: "/api/profile/edit-profile/",
    // Получение редактируемой записи о профиле
    get: async function (id) {
        try {
            // Получаем редактируемую запись о пользователе
            const item = await request(this.base_url + id);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorProfile.editProfile(null));

                return null;
            }

            // Сохраняем объект редактируемой записи в хранилище
            if (item) {
                store.dispatch(ActionCreator.ActionCreatorProfile.editProfile(item.profile));
            }

            return item.profile;
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorProfile.setErrorRecordProfile("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Обновляем запись профиля
    save: async function (item, setLoading) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Получаем обновленную запись
            const data = await request(this.base_url, "PUT", item);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorProfile.editProfile(null));

                // Останавливаем спиннер загрузки
                setLoading(false);

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux
                store.dispatch(ActionCreator.ActionCreatorProfile.editProfile(data.item));

                // Обновляем пользователя в редаксе, если активный и редактируемый пользователи совпадают
                const currentUser = store.getState().reducerAuth.user;

                if (currentUser && data.toUpdateUser && currentUser._id === data.toUpdateUser._id) {
                    store.dispatch(ActionCreator.ActionCreatorAuth.setUser(data.toUpdateUser));

                    const storageData = JSON.parse(localStorage.getItem("user"));
                    localStorage.setItem("user", JSON.stringify({
                        ...storageData,
                        user: data.toUpdateUser
                    }));
                }

                // Останавливаем спиннер загрузки
                setLoading(false);

                onRemove("profile", "remove");
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorProfile.setErrorRecordProfile("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    }
}