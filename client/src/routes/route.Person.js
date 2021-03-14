// Методы модели Персонал
import {message} from "antd";

import {Person} from "../model/Person";
import {ProfessionRoute} from "./route.profession";
import {DepartmentRoute} from "./route.Department";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import {getShortName, getShortNameRecord} from "../components/helpers/getShortName";

export const PersonRoute = {
    // Адрес для работы с разделом "Персонал"
    base_url: "/api/directory/people/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи разделов "Профессии", "Подразделения" и "Персонал"
            await ProfessionRoute.getAll();
            await DepartmentRoute.getAll();
            const itemsPeople = await request(this.base_url);

            // Записываем все записи в хранилище
            if (itemsPeople) {
                store.dispatch(ActionCreator.ActionCreatorPerson.getAllPeople(getShortName(itemsPeople)));
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении персонала: ", e);
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

                // Изменяем поле name только что сохраненной записи
                data.item = getShortNameRecord(data.item);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorPerson.createPerson(data.item));
                } else {
                    const people = store.getState().reducerPerson.people;
                    const foundPerson = people.find(person => {
                        return person._id === data.item._id;
                    });
                    const indexPerson = people.indexOf(foundPerson);

                    if (indexPerson >= 0 && foundPerson) {
                        store.dispatch(ActionCreator.ActionCreatorPerson.editPerson(indexPerson, data.item));
                    }
                }
            }

            // Удаление текущей вкладки
            onRemove(specKey, "remove");
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

                const people = store.getState().reducerPerson.people;

                // Удаляем запись из хранилища redux
                let foundPerson = people.find(person => {
                    return person._id === _id;
                });
                let indexPerson = people.indexOf(foundPerson);

                if (foundPerson && indexPerson >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorPerson.deletePerson(indexPerson));
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
        onRemove(specKey, "remove");
    },
    // Заполнение модели "Персонал"
    fillItem: function (item) {
        if (!item.person)
            return;

        // Создаем объект редактируемой записи
        let personItem = new Person(item.person);
        personItem.isNewItem = item.isNewItem;

        // Сохраняем объект редактируемой записи в хранилище
        store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(personItem));
    }
}