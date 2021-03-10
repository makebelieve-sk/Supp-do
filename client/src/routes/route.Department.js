// Методы модели Подразделения
import {message} from "antd";

import {Department} from "../model/Department";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import getParents from "../components/helpers/getRowParents.helper";

export const DepartmentRoute = {
    // Адрес для работы с разделом "Подразделения"
    base_url: "/api/directory/departments/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Подразделения"
            const items = await request(this.base_url);

            // Устанавливаем доп. поле: полное наименование
            if (items && items.length) {
                items.forEach(item => {
                    if (item.parent) {
                        item.nameWithParent = getParents(item, items) + item.name;
                    }
                })

                store.dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(items));
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении характеристик оборудования: ", e);
        }
    },
    // Получение редактируемой записи
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
    // Сохранение записи
    save: async function (item, setLoading, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            // Останавливаем спиннер загрузки
            setLoading(false);

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorDepartment.createDepartment(data.item));
                } else {
                    const departments = store.getState().reducerDepartment.departments;
                    const foundDepartment = departments.find(department => {
                        return department._id === item._id;
                    });
                    const indexDepartment = departments.indexOf(foundDepartment);

                    if (indexDepartment >= 0 && foundDepartment) {
                        store.dispatch(ActionCreator.ActionCreatorDepartment.editDepartment(indexDepartment, data.item));
                    }
                }
            }

            // Удаление текущей вкладки
            onRemove(specKey, 'remove');
        } catch (e) {
            // Останавливаем спиннер загрузки
            setLoading(false);
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                const departments = store.getState().reducerDepartment.departments;

                // Удаляем запись из хранилища redux
                let foundDepartment = departments.find(department => {
                    return department._id === _id;
                });
                let indexDepartment = departments.indexOf(foundDepartment);

                if (foundDepartment && indexDepartment >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorDepartment.deleteDepartment(indexDepartment));
                }
            }

            // Удаление текущей вкладки
            onRemove(specKey, 'remove');
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove, specKey) {
        onRemove(specKey, 'remove');
    },
    // Заполнение модели "Подразделения"
    fillItem: function (item) {
        if (!item.department)
            return;

        // Создаем объект редактируемой записи
        let departmentItem = new Department(item.department);
        departmentItem.isNewItem = item.isNewItem;

        store.dispatch(ActionCreator.ActionCreatorDepartment.setRowDataDepartment(departmentItem));
    }
}