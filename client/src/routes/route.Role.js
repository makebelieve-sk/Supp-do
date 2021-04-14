// Методы модели "Роли"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {Role} from "../model/Role";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";

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

            if (items) {
                const reducerRole = store.getState().reducerRole.roles;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reducerRole);

                if (shouldUpdate) {
                    // Записываем все роли в хранилище
                    store.dispatch(ActionCreator.ActionCreatorRole.getAllRoles(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении записей помощи: ", e);
        }
    },
    // Получение редактируемой роли
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            if (item) {
                // Заполняем модель записи
                this.fillItem(item);
            }
        } catch (e) {
            message.error("Возникла ошибка при получении записи: ", e);
        }
    },
    // Сохранение роли
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
                    store.dispatch(ActionCreator.ActionCreatorRole.createRole(data.item));
                } else {
                    const roles = store.getState().reducerRole.roles;

                    const foundRole = roles.find(role => role._id === item._id);
                    const indexRole = roles.indexOf(foundRole);

                    if (indexRole >= 0 && foundRole) {
                        store.dispatch(ActionCreator.ActionCreatorRole.editRole(indexRole, data.item));
                    }
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Останавливаем спиннер загрузки
            setLoading(false);
        }

    },
    // Удаление роли
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

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
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            // Удаление текущей вкладки
            this.cancel(onRemove)
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove) {
        // Удаление текущей вкладки
        onRemove("roleItem", "remove");
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