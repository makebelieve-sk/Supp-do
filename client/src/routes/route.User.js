// Методы модели "Пользователи"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {User} from "../model/User";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import {NoticeError, storePeople, storeRole} from "./helper";

export const UserRoute = {
    // Адрес для работы с разделом "Пользователи"
    base_url: "/api/admin/users/",
    // Получение всех записей о пользователях
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Пользователи"
            const items = await request(this.base_url);

            if (items) {
                const reduxUser = store.getState().reducerUser.users;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxUser);

                if (shouldUpdate) {
                    // Записываем все записи помощи в хранилище
                    store.dispatch(ActionCreator.ActionCreatorUser.getAllUsers(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorUser.setErrorTable("Возникла ошибка при получении записей: " + e));
            NoticeError.getAll(e); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой записи о пользователе
    get: async function (id) {
        try {
            // Получаем редактируемую запись о пользователе
            const item = await request(this.base_url + id);
            const people = await request("/api/directory/people/");
            const roles = await request("/api/admin/roles/");

            // Записываем полученные записи раздела "Персонал" в хранилище
            storePeople(people);

            // Записываем полученные записи раздела "Роли" в хранилище
            storeRole(roles);

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorUser.setErrorRecord("Возникла ошибка при получении записи: " + e));
            NoticeError.get(e); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение записи о пользователе
    save: async function (item, setLoading, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorUser.createUser(data.item));
                } else {
                    const users = store.getState().reducerUser.users;

                    const foundUser = users.find(user => user._id === item._id);
                    const indexUser = users.indexOf(foundUser);

                    if (indexUser >= 0 && foundUser) {
                        store.dispatch(ActionCreator.ActionCreatorUser.editUser(indexUser, data.item));
                    }
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorUser.setErrorRecord("Возникла ошибка при сохранении записи: " + e));
            NoticeError.save(e, setLoading);    // Вызываем функцию обработки ошибки
        }

    },
    // Удаление записи о пользователе
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                // Получаем список записей о пользователях из хранилища
                const users = store.getState().reducerUser.users;

                // Удаляем запись из хранилища redux
                const foundUser = users.find(user => user._id === _id);
                const indexUser = users.indexOf(foundUser);

                if (foundUser && indexUser >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorUser.deleteUser(indexUser));
                }
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            // Удаление текущей вкладки
            this.cancel(onRemove)
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorUser.setErrorRecord("Возникла ошибка при удалении записи: " + e));
            NoticeError.delete(e, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }

    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove) {
        // Удаление текущей вкладки
        onRemove("userItem", "remove");
    },
    // Заполнение модели "Пользователи"
    fillItem: function (item) {
        if (!item.user) return;

        // Создаем объект редактируемой записи
        const userRecord = new User(item.user);
        userRecord.isNewItem = item.isNewItem;

        const reduxUserRecord = store.getState().reducerUser.rowDataUser;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(userRecord, reduxUserRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorUser.setRowDataUser(userRecord));
        }
    }
}