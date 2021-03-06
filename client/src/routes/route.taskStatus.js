// Методы модели Состояние заявки
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import {TaskStatus} from "../model/TaskStatus";

export const TaskStatusRoute = {
    base_url: "/api/directory/taskStatus/",
    getAll: async function () {
        try {
            const items = await request(this.base_url);

            if (items) {
                store.dispatch(ActionCreator.ActionCreatorTask.getAllTasks(items));
            }
        } catch (e) {
            message.error("Возникла ошибка при получении состояний заявок: ", e);
        }
    },
    get: async function (id) {
        try {
            const item = await request(this.base_url + id);

            if (item) {
                this.fillItem(item);
            }
        } catch (e) {
            message.error("Возникла ошибка при получении записи: ", e);
        }
    },
    save: async function (item, setLoading, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            const method = item.isNewItem ? "POST" : "PUT";

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
            onRemove(specKey, 'remove');
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }

    },
    cancel: function (onRemove, specKey) {
        // Удаление текущей вкладки
        onRemove(specKey, 'remove');
    },
    fillItem: function (item) {
        if (!item.task)
            return;

        let taskItem = new TaskStatus(item.task);
        taskItem.isNewItem = item.isNewItem;

        store.dispatch(ActionCreator.ActionCreatorTask.setRowDataTask(taskItem));
    }
}