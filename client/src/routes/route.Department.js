// Методы модели "Подразделения"
import {message} from "antd";

import {Department} from "../model/Department";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {getParents} from "../helpers/functions/general.functions/replaceField";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import {NoticeError, storeDepartments} from "./helper";

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

            // Записываем полученные записи раздела "Подразделения" в хранилище
            storeDepartments(items);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorDepartment.setErrorTable("Возникла ошибка при получении всех записей: " + e));
            NoticeError.getAll(e); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой записи
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorDepartment.setErrorRecord("Возникла ошибка при получении записи: " + e));
            NoticeError.get(e); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение записи
    save: async function (item, setLoading, onRemove, departments) {
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

                // Добавление поля nameWithParent
                if (data.item.parent) {
                    data.item.nameWithParent = getParents(data.item, departments) + data.item.name;
                }

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorDepartment.createDepartment(data.item));
                } else {
                    const departments = store.getState().reducerDepartment.departments;

                    const foundDepartment = departments.find(department => department._id === item._id);
                    const indexDepartment = departments.indexOf(foundDepartment);

                    if (indexDepartment >= 0 && foundDepartment) {
                        store.dispatch(ActionCreator.ActionCreatorDepartment.editDepartment(indexDepartment, data.item));
                    }
                }

                // Получаем объект поля "Подразделения", он есть, если мы нажали на "+"
                const replaceField = store.getState().reducerReplaceField.replaceFieldDepartment;

                if (replaceField.key) {
                    // Обновляем поле
                    setFieldRecord(replaceField, data.item);
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Обнуляем объект поля "Подразделения" (при нажатии на "+")
            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldDepartment({
                key: null,
                formValues: null
            }));

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorDepartment.setErrorTable("Возникла ошибка при сохранении записи: " + e));
            NoticeError.save(e, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                const departments = store.getState().reducerDepartment.departments;

                // Удаляем запись из хранилища redux
                const foundDepartment = departments.find(department => department._id === _id);
                const indexDepartment = departments.indexOf(foundDepartment);

                if (foundDepartment && indexDepartment >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorDepartment.deleteDepartment(indexDepartment));
                }
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorDepartment.setErrorTable("Возникла ошибка при удалении записи: " + e));
            NoticeError.delete(e, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove) {
        onRemove("departmentItem", "remove");
    },
    // Заполнение модели "Подразделения"
    fillItem: function (item) {
        if (!item.department)
            return;

        // Создаем объект редактируемой записи
        const departmentRecord = new Department(item.department);
        departmentRecord.isNewItem = item.isNewItem;

        // Получаем запись из редакса
        const reduxDepartmentRecord = store.getState().reducerDepartment.rowDataDepartment;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(departmentRecord, reduxDepartmentRecord);

        if (shouldUpdate) {
            store.dispatch(ActionCreator.ActionCreatorDepartment.setRowDataDepartment(departmentRecord));
        }
    }
}