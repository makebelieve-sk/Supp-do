// Методы модели Персонал
import {message} from "antd";

import {Person} from "../model/Person";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {getParents} from "../helpers/functions/general.functions/replaceField";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";

export const PersonRoute = {
    // Адрес для работы с разделом "Персонал"
    base_url: "/api/directory/people/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи разделов "Профессии", "Подразделения" и "Персонал"
            const itemsPeople = await request(this.base_url);

            // Записываем все записи в хранилище
            if (itemsPeople) {
                const reduxPeople = store.getState().reducerPerson.people;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(itemsPeople, reduxPeople);

                if (shouldUpdate) {
                    store.dispatch(ActionCreator.ActionCreatorPerson.getAllPeople(itemsPeople));
                }
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
            const professions = await request("/api/directory/professions/");
            const departments = await request("/api/directory/departments/");

            if (professions && professions.length) {
                const reduxProfessions = store.getState().reducerProfession.professions;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(professions, reduxProfessions);

                if (shouldUpdate) {
                    store.dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(professions));
                }
            }

            if (departments && departments.length) {
                const reduxDepartments = store.getState().reducerDepartment.departments;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(departments, reduxDepartments);

                if (shouldUpdate) {
                    departments.forEach(department => {
                        department.nameWithParent = getParents(department, departments) + department.name;
                    });

                    store.dispatch(ActionCreator.ActionCreatorDepartment.getAllDepartments(departments));
                }
            }

            if (item) {
                // Заполняем модель записи
                this.fillItem(item);
            }
        } catch (e) {
            message.error("Возникла ошибка при получении записи: ", e);
        }
    },
    // Сохранение записи
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
                    setFieldRecord(replaceField, data.item);
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Обнуляем объект поля "Персонал" (при нажатии на "+")
            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldPerson({
                key: null,
                formValues: null
            }));

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Останавливаем спиннер загрузки
            setLoading(false);
            console.log(e)
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

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
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove) {
        onRemove("personItem", "remove");
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