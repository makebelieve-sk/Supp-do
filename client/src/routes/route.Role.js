// Методы модели "Роли"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {Role} from "../model/Role";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import {NoticeError, storeRole} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";
import {StorageVars} from "../options";

export const RoleRoute = {
    // Адрес для работы с разделом "Роли"
    base_url: "/api/admin/roles/",
    // Получение всех ролей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Роли"
            const items = await request(this.base_url);

            // Записываем полученные записи раздела "Роли" в хранилище
            storeRole(items);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorRole.setErrorTableRole("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой роли
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorRole.setRowDataRole(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("roleItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorRole.setErrorRecordRole("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение роли
    save: async function (item, setLoading) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                await this.getAll();    // Обновляем все записи раздела

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorRole.setRowDataRole(null));

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("roleItem", "remove");

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorRole.createRole(data.item));
                } else {
                    const roles = store.getState().reducerRole.roles;

                    const foundRole = roles.find(role => role._id === item._id);
                    const indexRole = roles.indexOf(foundRole);

                    if (indexRole >= 0 && foundRole) {
                        store.dispatch(ActionCreator.ActionCreatorRole.editRole(indexRole, data.item));
                    }
                }

                // Обновляем поле роли объекта пользователя в редаксе, если активный и редактируемый пользователи совпадают
                const currentUser = store.getState().reducerAuth.user;

                if (currentUser && currentUser.roles && currentUser.roles.length && data && data.item) {
                    currentUser.roles.forEach((role, index)=> {
                        if (role._id === data.item._id) {
                            currentUser.roles[index] = data.item;
                        }
                    });

                    store.dispatch(ActionCreator.ActionCreatorAuth.setUser(currentUser));

                    // Обновляем пользователя в хранилище браузера
                    const token = JSON.parse(localStorage.getItem(StorageVars.user)).token;
                    localStorage.setItem(StorageVars.user, JSON.stringify({token, user: currentUser}));
                }

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("roleItem", "remove");
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorRole.setErrorRecordRole("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }

    },
    // Удаление роли
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Не даем удалить роль пользователя в редакс, если она осталась последняя и если активный и редактируемый пользователи совпадают
            const currentUser = store.getState().reducerAuth.user;

            if (currentUser && currentUser.roles && _id) {
                if (currentUser.roles.length > 1) {
                    currentUser.roles.forEach((role, index)=> {
                        if (role._id === _id) {
                            currentUser.roles.splice(index, 1);
                        }
                    });
                } else {
                    message.error("Невозможно удалить последнюю роль данного пользователя");
                    // Останавливаем спиннер, и скрываем всплывающее окно
                    setLoadingDelete(false);
                    setVisiblePopConfirm(false);
                    return null;
                }

                store.dispatch(ActionCreator.ActionCreatorAuth.setUser(currentUser));
            }

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                await this.getAll();    // Обновляем все записи раздела

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorRole.setRowDataRole(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("roleItem", "remove");

                return null;
            }

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                // Получаем список ролей из хранилища
                const roles = store.getState().reducerRole.roles;

                // Удаляем запись из хранилища redux
                const foundRole = roles.find(role => role._id === _id);
                const indexRole = roles.indexOf(foundRole);

                if (foundRole && indexRole >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorRole.deleteRole(indexRole));
                }

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorRole.setRowDataRole(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("roleItem", "remove");
            } else {
                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorRole.setErrorRecordRole("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Заполнение модели "Помощь"
    fillItem: function (item) {
        if (!item.role)
            return;

        // Создаем объект редактируемой записи
        const roleRecord = new Role(item.role);
        roleRecord.isNewItem = item.isNewItem;

        const reducerRoleRecord = store.getState().reducerRole.rowDataRole;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(roleRecord, reducerRoleRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorRole.setRowDataRole(roleRecord));
        }
    }
}