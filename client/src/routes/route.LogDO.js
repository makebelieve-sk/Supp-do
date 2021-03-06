// Методы модели Журнала дефектов и отказов
import moment from "moment";
import {message} from "antd";

import {Departments} from "../model/Department";
import {People} from "../model/Person";
import {Equipment} from "../model/equipment";
import {LogDO} from "../model/LogDO";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import getParents from "../components/helpers/getRowParents.helper";
import TabOptions from "../options/tab.options/tab.options";
import {TaskStatusRoute} from "./route.taskStatus";

export const LogDORoute = {
    base_url: "/api/log-do/",
    file_url: "/files/",
    getAll: async function (date = moment().startOf("month").format(TabOptions.dateFormat)
    + "/" + moment().endOf("month").format(TabOptions.dateFormat)) {
        try {
            const items = await request(this.base_url + date);
            const itemsEquipment = await request(Equipment.base_url);
            const itemsDepartments = await request(Departments.base_url);
            const itemsPeople = await request(People.base_url);
            const itemsTasks = await request(TaskStatusRoute.base_url);

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
        } catch (e) {
            message.error("Возникла ошибка при получении записей журнала дефектов и отказов: ", e);
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

                // Обновляем список записей в таблице с начала месяца по конец месяца
                // await this.getAll();
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
    fillItem: function (item) {
        if (!item.logDO)
            return;

        let logDOItem = new LogDO(item.logDO);
        logDOItem.isNewItem = item.isNewItem;

        store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO(logDOItem));
        store.dispatch(ActionCreator.ActionCreatorLogDO.getAllFiles(logDOItem.files));
    }
}