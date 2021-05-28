// Методы модели "Журнал действий пользователя"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import {NoticeError} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";
import {Log} from "../model/Log";
import moment from "moment";
import TabOptions from "../options/tab.options/record.options";

export const LogRoute = {
    // Адрес для работы с разделом "Журнал действий пользователя"
    base_url: "/api/admin/logs/",
    // Получение всех записей журнала
    getAll: async function (
        date = moment().startOf("month").format(TabOptions.dateFormat) +
        "/" + moment().endOf("month").format(TabOptions.dateFormat)
    ) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Журнал действий пользователя"
            const items = await request(this.base_url + date);

            if (items) {
                const reduxLog = store.getState().reducerLog.logs;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxLog);

                if (shouldUpdate) {
                    // Записываем все записи помощи в хранилище
                    store.dispatch(ActionCreator.ActionCreatorLog.getAllLog(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLog.setErrorTableLog("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой записи помощи
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorLog.setRowDataLog(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("logItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLog.setErrorRecordLog("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записей журнала за выбранный период
    deleteByPeriod: async function (setLoadingDelete, setVisiblePopConfirm) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            const date = store.getState().reducerLog.dateLog;   // Получаем период

            // Удаляем записи
            const data = await request(this.base_url + date, "DELETE");

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                await this.getAll();    // Обновляем все записи раздела

                return null;
            }

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                if (data.logsId && data.logsId.length) {
                    data.logsId.forEach(deleteId => {
                        // Получаем список записей действий пользователей из хранилища
                        const logs = store.getState().reducerLog.logs;

                        // Удаляем запись из хранилища redux
                        const foundLog = logs.find(log => log._id === deleteId);
                        const indexLog = logs.indexOf(foundLog);

                        if (foundLog && indexLog >= 0) {
                            store.dispatch(ActionCreator.ActionCreatorLog.deleteLog(indexLog));
                        }
                    });
                }
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLog.setErrorTableLog("Возникла ошибка при удалении записей за выбранный период: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи журнала
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                await this.getAll();    // Обновляем все записи раздела

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorLog.setRowDataLog(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("logItem", "remove");

                return null;
            }

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                // Получаем список записей помощи из хранилища
                const logs = store.getState().reducerLog.logs;

                // Удаляем запись из хранилища redux
                const foundLog = logs.find(log => log._id === _id);
                const indexLog = logs.indexOf(foundLog);

                if (foundLog && indexLog >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorLog.deleteLog(indexLog));
                }

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorLog.setRowDataLog(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("logItem", "remove");
            } else {
                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLog.setErrorRecordLog("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Заполнение модели "Журнал действий пользователя"
    fillItem: function (item) {
        if (!item)
            return;

        // Создаем объект редактируемой записи
        const logRecord = new Log(item);

        const reduxLogRecord = store.getState().reducerLog.rowDataLog;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(logRecord, reduxLogRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorLog.setRowDataLog(logRecord));
        }
    }
}