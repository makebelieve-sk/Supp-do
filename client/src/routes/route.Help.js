// Методы модели "Помощь"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import {Help} from "../model/Help";

export const HelpRoute = {
    // Адрес для работы с разделом "Помощь"
    base_url: "/api/admin/help/",
    // Получение всех записей помощи
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Помощь"
            const items = await request(this.base_url);

            if (items) {
                const reduxHelp = store.getState().reducerHelp.help;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxHelp);

                if (shouldUpdate) {
                    // Записываем все записи помощи в хранилище
                    store.dispatch(ActionCreator.ActionCreatorHelp.getAllHelp(items));
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
    // Получение редактируемой записи помощи
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
    // Получение записи помощи при клике на кнопку "Помощь"
    getHelpToModal: async function (id) {
        try {
            // Получаем запись при клике на кнопку "Помощь"
            return await request(this.base_url + "get/" + id);
        } catch (e) {
            message.error("Возникла ошибка при получении записи: ", e);
        }
    },
    // Сохранение записи помощи
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
                    store.dispatch(ActionCreator.ActionCreatorHelp.createHelp(data.item));
                } else {
                    const help = store.getState().reducerHelp.help;

                    const foundHelp = help.find(hlp => hlp._id === item._id);
                    const indexHelp = help.indexOf(foundHelp);

                    if (indexHelp >= 0 && foundHelp) {
                        store.dispatch(ActionCreator.ActionCreatorHelp.editHelp(indexHelp, data.item));
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
    // Удаление записи помощи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                // Получаем список записей помощи из хранилища
                const help = store.getState().reducerHelp.help;

                // Удаляем запись из хранилища redux
                const foundHelp = help.find(hlp => hlp._id === _id);
                const indexHelp = help.indexOf(foundHelp);

                if (foundHelp && indexHelp >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorHelp.deleteHelp(indexHelp));
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
        onRemove("helpItem", "remove");
    },
    // Заполнение модели "Помощь"
    fillItem: function (item) {
        if (!item.help)
            return;

        // Создаем объект редактируемой записи
        const helpRecord = new Help(item.help);
        helpRecord.isNewItem = item.isNewItem;

        const reduxHelpRecord = store.getState().reducerHelp.rowDataHelp;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(helpRecord, reduxHelpRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorHelp.setRowDataHelp(helpRecord));
        }
    }
}