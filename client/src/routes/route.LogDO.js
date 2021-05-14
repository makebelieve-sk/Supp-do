// Методы модели "Журнал дефектов и отказов"
import moment from "moment";
import {message} from "antd";

import {LogDoRecord} from "../model/LogDo";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import {request} from "../helpers/functions/general.functions/request.helper";
import TabOptions from "../options/tab.options/record.options/record.options";
import {NoticeError, storeDepartments, storeEquipment, storeLogDO, storePeople, storeTask} from "./helper";
import {onRemove} from "../components/content.components/content/content.component";
import {AnalyticRoute} from "./route.Analytic";

export const LogDORoute = {
    // Адрес для работы с разделом "Журнал дефектов и отказов"
    base_url: "/api/logDO/",
    // Адрес для работы с файлами
    file_url: "/files/",
    // Получение всех записей
    getAll: async function (
        date = moment().startOf("month").format(TabOptions.dateFormat) +
        "/" + moment().endOf("month").format(TabOptions.dateFormat)
    ) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Журнал дефектов и отказов"
            const itemsLogDoDto = await request(this.base_url + "dto/" + date);

            // Записываем все записи в хранилище
            storeLogDO(itemsLogDoDto);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLogDO.setErrorTableLogDO("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Получение записи
    get: async function (id) {
        try {
            // Получаем запись
            const item = await request(this.base_url + id);

            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("logDOItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            const departments = await request("/api/directory/departments/");
            const people = await request("/api/directory/people/");
            const equipment = await request("/api/directory/equipment/");
            const tasks = await request("/api/directory/tasks/");

            // Записываем полученные записи раздела "Подразделения" в хранилище
            storeDepartments(departments);

            // Записываем полученные записи раздела "Персонал" в хранилище
            storePeople(people);

            // Записываем полученные записи раздела "Оборудование" в хранилище
            storeEquipment(equipment);

            // Записываем полученные записи раздела "Состояние заявок" в хранилище
            storeTask(tasks);

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLogDO.setErrorRecordLogDO("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение записи
    save: async function (item, setLoading) {
        try {
            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            if (typeof data === "string") {
                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("logDOItem", "remove");

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Получаем из редакса объект фильтра
                const alert = store.getState().reducerLogDO.alert;

                // Если указан фильтр (был переход с аналитики или статистики)
                if (alert.url || alert.alert) {
                    await AnalyticRoute.goToLogDO(alert.url, alert.filter);
                } else {
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

                    // Обновляем список записей в таблице по выбранной дате
                    const currentDate = store.getState().reducerLogDO.date;
                    await this.getAll(currentDate);
                }

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("logDOItem", "remove");
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLogDO.setErrorRecordLogDO("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm) {
        try {
            // await this.getAll();    // Обновляем все записи раздела

            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем файлы
            const fileInfo = await request(this.file_url + "delete/" + _id, "DELETE", {model: "logDO"});

            if (fileInfo) {
                // Удаляем запись
                const data = await request(this.base_url + _id, "DELETE");

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

                    // Обновляем список записей в таблице по выбранной дате
                    const currentDate = store.getState().reducerLogDO.date;
                    await this.getAll(currentDate);

                    // Останавливаем спиннер, и скрываем всплывающее окно
                    setLoadingDelete(false);
                    setVisiblePopConfirm(false);

                    // Удаление текущей вкладки
                    onRemove("logDOItem", "remove");
                } else {
                    // Останавливаем спиннер, и скрываем всплывающее окно
                    setLoadingDelete(false);
                    setVisiblePopConfirm(false);
                }
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLogDO.setErrorRecordLogDO("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: async function (setLoadingCancel) {
        try {
            setLoadingCancel(true);

            const fileInfo = await request(this.file_url + "cancel", "DELETE");

            if (fileInfo) {
                setLoadingCancel(false);
                onRemove("logDOItem", "remove");
            }
        } catch (e) {
            setLoadingCancel(false);
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLogDO.setErrorRecordLogDO("Возникла ошибка при удалении добавленных файлов из записи: " + e.message));
            NoticeError.cancel(e.message);    // Вызываем функцию обработки ошибки
        }
    },
    // Заполнение модели записи раздела "Журнал дефектов и отказов"
    fillItem: function (item) {
        if (!item) throw new Error("Возникла ошибка при получении записи");

        // Создаем объект записи
        const logDoRecord = new LogDoRecord(item.logDo, item.isNewItem);

        // Получаем запись из редакса
        const reduxLogDoRecord = store.getState().reducerLogDO.rowDataLogDO;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(logDoRecord, reduxLogDoRecord);

        // Если объекты не равны, то обновляем запись в редаксе
        if (shouldUpdate) {
            store.dispatch(ActionCreator.ActionCreatorLogDO.setRowDataLogDO(logDoRecord));
            store.dispatch(ActionCreator.ActionCreatorLogDO.getAllFiles(logDoRecord.files));
        }
    }
}