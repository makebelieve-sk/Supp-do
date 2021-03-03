// Модель для справочника Подразделения
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import getParents from "../components/helpers/getRowParents.helper";

export const Departments = {
    base_url: "/api/directory/departments/",
    getAll: async function () {
        const items = await request(this.base_url);

        if (items && items.length) {
            items.forEach(item => {
                if (item.parent) {
                    item.nameWithParent = getParents(item, items) + item.name;
                }
            })

            store.dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(items));
        }
    },
    get: async function (id) {
        const item = await request(this.base_url + id);

        if (item && item.department) {
            this.fillItem(item.department);
        }
    },
    save: async function (item, setLoading, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            const method = item.isCreated ? "POST" : "PUT";

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
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

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
    cancel: function (onRemove, specKey) {
        onRemove(specKey, 'remove');
    },
    fillItem: function (item) {
        if (!item)
            return;

        const departmentItem = {
            _id: item._id,
            isCreated: item.isCreated,
            name: item.name,
            notes: item.notes,
            parent: item.parent
        };

        store.dispatch(ActionCreator.ActionCreatorDepartment.setRowDataDepartment(departmentItem));
    }
}