// Методы модели Состояние заявки
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import {TaskStatus} from "../model/TaskStatus";

export const TaskStatusRoute = {
    // Адрес для работы с разделом "Состояние заявок"
    base_url: "/api/directory/taskStatus/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Состояние заявок"
            const items = await request(this.base_url);

            if (items) {
                // Записываем все записи в хранилище
                store.dispatch(ActionCreator.ActionCreatorTask.getAllTasks(items));
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении состояний заявок: ", e);
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
                    store.dispatch(ActionCreator.ActionCreatorTask.createTask(data.item));
                } else {
                    const tasks = store.getState().reducerTask.tasks;
                    const foundTask = tasks.find(task => {
                        return task._id === item._id;
                    });
                    const indexTask = tasks.indexOf(foundTask);

                    if (indexTask >= 0 && foundTask) {
                        store.dispatch(ActionCreator.ActionCreatorTask.editTask(indexTask, data.item));
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

                const tasks = store.getState().reducerTask.tasks;

                // Удаляем запись из хранилища redux
                let foundTask = tasks.find(task => {
                    return task._id === _id;
                });
                let indexTask = tasks.indexOf(foundTask);

                if (foundTask && indexTask >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorTask.deleteTask(indexTask));
                }
            }

            // Удаление текущей вкладки
            onRemove(specKey, "remove");
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }

    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove, specKey) {
        // Удаление текущей вкладки
        onRemove(specKey, 'remove');
    },
    // Заполнение модели "Состояние заявок"
    fillItem: function (item) {
        if (!item.task)
            return;

        // Создаем объект редактируемой записи
        let taskItem = new TaskStatus(item.task);
        taskItem.isNewItem = item.isNewItem;

        // Сохраняем объект редактируемой записи в хранилище
        store.dispatch(ActionCreator.ActionCreatorTask.setRowDataTask(taskItem));
    }
}