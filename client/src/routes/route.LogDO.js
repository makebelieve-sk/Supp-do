// Методы модели Журнала дефектов и отказов
import moment from "moment";
import {message} from "antd";

import {LogDO} from "../model/LogDO";
import {DepartmentRoute} from "./route.Department";
import {PersonRoute} from "./route.Person";
import {EquipmentRoute} from "./route.Equipment";
import {TaskStatusRoute} from "./route.taskStatus";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import getParents from "../components/helpers/getRowParents.helper";
import TabOptions from "../options/tab.options/tab.options";

export const LogDORoute = {
    // Адрес для работы с разделом "Журнал дефектов и отказов"
    base_url: "/api/log-do/",
    // Адрес для работы с файлами
    file_url: "/files/",
    // Получение всех записей
    getAll: async function (date = moment().startOf("month").format(TabOptions.dateFormat)
    + "/" + moment().endOf("month").format(TabOptions.dateFormat)) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи разделов "Журнал дефектов и отказов", "Оборудование", "Подразделения", "Персонал" и "Состояние заявок"
            const items = await request(this.base_url + date);
            const itemsEquipment = await request(EquipmentRoute.base_url);
            const itemsDepartments = await request(DepartmentRoute.base_url);
            const itemsPeople = await request(PersonRoute.base_url);
            const itemsTasks = await request(TaskStatusRoute.base_url);

            // Записываем все записи в хранилище
            if (items) {
                store.dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(items));
            }

            if (itemsEquipment && itemsEquipment.length) {
                itemsEquipment.forEach(item => {
                    if (item.parent) {
                        item.nameWithParent = getParents(item, itemsEquipment) + item.name;
                    }
                })

                store.dispatch(ActionCreator.ActionCreatorEquipment.getAllEquipment(itemsEquipment));
            }

            if (itemsDepartments && itemsDepartments.length) {
                itemsDepartments.forEach(item => {
                    if (item.parent) {
                        item.nameWithParent = getParents(item, itemsDepartments) + item.name;
                    }
                })

                store.dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(itemsDepartments));
            }

            if (itemsPeople) {
                store.dispatch(ActionCreator.ActionCreatorPerson.getAllPeople(itemsPeople));
            }

            if (itemsTasks) {
                store.dispatch(ActionCreator.ActionCreatorTask.getAllTasks(itemsTasks));
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении записей журнала дефектов и отказов: ", e);
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
                    store.dispatch(ActionCreator.ActionCreatorLogDO.createLogDO(data.item));
                } else {
                    const logDO = store.getState().reducerLogDO.logDO;
                    const foundLogDO = logDO.find(log => {
                        return log._id === item._id;
                    });
                    const indexLogDO = logDO.indexOf(foundLogDO);

                    if (indexLogDO >= 0 && foundLogDO) {
                        store.dispatch(ActionCreator.ActionCreatorLogDO.editLogDO(indexLogDO, data.item));
                    }
                }
            }

            // Удаление текущей вкладки
            onRemove(specKey, "remove");

            // Обновляем список записей в таблице по выбранной дате
            const currentDate = store.getState().reducerLogDO.date;
            await this.getAll(currentDate);
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

            // Удаляем файлы
            const fileInfo = await request(this.file_url + "delete/" + _id, "DELETE", {model: "logDO"});

            if (fileInfo) {
                // Удаляем запись
                const data = await request(this.base_url + _id, "DELETE");

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                if (data) {
                    // Вывод сообщения
                    message.success(data.message);

                    const logDO = store.getState().reducerLogDO.logDO;

                    // Удаляем запись из хранилища redux
                    let foundLogDO = logDO.find(log => {
                        return log._id === _id;
                    });
                    let indexLogDO = logDO.indexOf(foundLogDO);

                    if (foundLogDO && indexLogDO >= 0) {
                        store.dispatch(ActionCreator.ActionCreatorLogDO.deleteLogDO(indexLogDO));
                    }
                }

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');
            }
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }

    },
    // Нажатие на кнопку "Отмена"
    cancel: async function (onRemove, specKey, setLoadingCancel) {
        try {
            setLoadingCancel(true);

            const fileInfo = await request(this.file_url + "cancel", "DELETE");

            if (fileInfo) {
                setLoadingCancel(false);
                onRemove(specKey, 'remove');
            }
        } catch (e) {
            message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
            setLoadingCancel(false);
        }
    },
    // Заполнение модели "Журнал дефектов и отказов"
    fillItem: function (item) {
        if (!item.logDO)
            return;

        // Создаем объект редактируемой записи
        let logDOItem = new LogDO(item.logDO);
        logDOItem.isNewItem = item.isNewItem;

        // Сохраняем объект редактируемой записи в хранилище
        store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO(logDOItem));
        store.dispatch(ActionCreator.ActionCreatorLogDO.getAllFiles(logDOItem.files));
    }
}