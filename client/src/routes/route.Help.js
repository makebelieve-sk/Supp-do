// Методы модели "Помощь"
import {message} from "antd";
import ReactHtmlParser from "react-html-parser";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import {Help} from "../model/Help";
import {NoticeError} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";

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
                items.forEach(item => {
                    item.textParser = item.text
                        ? ReactHtmlParser(item.text.length > 100 ? item.text.slice(0, 100) + " ..." : item.text)
                        : "";

                    item.text = item.text ? ReactHtmlParser(item.text) : "";
                });

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
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorHelp.setErrorTableHelp("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Возврат ключа таблицы вместо ключа записи
    getKey: function(key) {
        const map = new Map([
            ["professionItem", "professions"],
            ["departmentItem", "departments"],
            ["personItem", "people"],
            ["equipmentItem", "equipment"],
            ["equipmentPropertyItem", "equipmentProperties"],
            ["taskStatusItem", "tasks"],
            ["logDOItem", "logDO"],
            ["helpItem", "help"],
            ["userItem", "users"],
            ["roleItem", "roles"],
            ["logItem", "logs"],
        ]);

        return map.has(key) ? map.get(key) : key;
    },
    // Получение редактируемой записи помощи
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorHelp.setRowDataHelp(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("helpItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorHelp.setErrorRecordHelp("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Получение записи помощи при клике на кнопку "Помощь"
    getHelpToModal: async function (key) {
        try {
            const keySection = this.getKey(key);

            // Получаем запись при клике на кнопку "Помощь"
            return await request(this.base_url + "get/" + keySection);
        } catch (e) {
            console.log(e.message);
            message.error("Возникла ошибка при получении записи: ", e.message);
            throw new Error(e.message);
        }
    },
    // Сохранение записи помощи
    save: async function (item, setLoading) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                await this.getAll();    // Обновляем все записи раздела

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorHelp.setRowDataHelp(null));

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("helpItem", "remove");

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                data.item.textParser = data.item.text
                    ? ReactHtmlParser(
                        data.item.text.length > 100
                            ? data.item.text.slice(0, 100) + " ..."
                            : data.item.text
                    )
                    : "";

                data.item.text = data.item.text ? ReactHtmlParser(data.item.text) : "";

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

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("helpItem", "remove");
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorHelp.setErrorRecordHelp("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи помощи
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
                store.dispatch(ActionCreator.ActionCreatorHelp.setRowDataHelp(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("helpItem", "remove");

                return null;
            }

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

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorHelp.setRowDataHelp(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("helpItem", "remove");
            } else {
                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorHelp.setErrorRecordHelp("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
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