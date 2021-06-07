// Методы модели Персонал
import {message} from "antd";

import {Person} from "../model/Person";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import {NoticeError, storeDepartments, storePeople, storeProfessions} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";

export const PersonRoute = {
    // Адрес для работы с разделом "Персонал"
    base_url: "/api/directory/people/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи разделов "Профессии", "Подразделения" и "Персонал"
            const items = await request(this.base_url);

            // Записываем полученные записи раздела "Персонал" в хранилище
            storePeople(items);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorPerson.setErrorTablePerson("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой записи
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("personItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            const professions = await request("/api/directory/professions/");
            const departments = await request("/api/directory/departments/");

            // Записываем полученные записи раздела "Профессии" в хранилище
            storeProfessions(professions);

            // Записываем полученные записи раздела "Подразделения" в хранилище
            storeDepartments(departments);

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorPerson.setErrorRecordPerson("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение записи
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

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(null));

                // Удаление текущей вкладки
                onRemove("personItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorPerson.createPerson(data.item));
                } else {
                    const people = store.getState().reducerPerson.people;

                    const foundPerson = people.find(person => person._id === data.item._id);
                    const indexPerson = people.indexOf(foundPerson);

                    if (indexPerson >= 0 && foundPerson) {
                        store.dispatch(ActionCreator.ActionCreatorPerson.editPerson(indexPerson, data.item));
                    }
                }

                // Получаем объект поля "Персонал", он есть, если мы нажали на "+"
                const replaceField = store.getState().reducerReplaceField.replaceFieldPerson;

                if (replaceField.key) {
                    // Обновляем поле
                    setFieldRecord(replaceField, data.currentItem);
                }

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Обнуляем объект поля "Персонал" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                    key: null,
                    formValues: null
                }));

                // Удаление текущей вкладки
                onRemove("personItem", "remove")  // Удаляем открытую вкладку
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);

                // Обнуляем объект поля "Персонал" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                    key: null,
                    formValues: null
                }));
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorPerson.setErrorRecordPerson("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи
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
                store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("personItem", "remove");

                return null;
            }

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                const people = store.getState().reducerPerson.people;

                // Удаляем запись из хранилища redux
                const foundPerson = people.find(person => person._id === _id);
                const indexPerson = people.indexOf(foundPerson);

                if (foundPerson && indexPerson >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorPerson.deletePerson(indexPerson));
                }

                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(null));

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("personItem", "remove");
            } else {
                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorPerson.setErrorRecord("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Заполнение модели "Персонал"
    fillItem: function (item) {
        if (!item.person)
            return;

        // Создаем объект редактируемой записи
        const personRecord = new Person(item.person);
        personRecord.isNewItem = item.isNewItem;

        // Получаем запись из редакса
        const reduxPersonRecord = store.getState().reducerPerson.rowDataPerson;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(personRecord, reduxPersonRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(personRecord));
        }
    }
}