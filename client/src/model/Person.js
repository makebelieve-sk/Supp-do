// Модель для справочника Персонал
import {message} from "antd";

import {ProfessionRoute} from "../routes/route.profession";
import {Departments} from "./Department";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import getParents from "../components/helpers/getRowParents.helper";

export const People = {
    base_url: "/api/directory/people/",
    getAll: async function () {
        try {
            const itemsProfessions = await request(ProfessionRoute.base_url);
            const itemsDepartments = await request(Departments.base_url);
            const itemsPeople = await request(this.base_url);

            if (itemsProfessions) {
                store.dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(itemsProfessions));
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
        } catch (e) {
            message.error("Возникла ошибка при получении персонала: ", e);
        }
    },
    get: async function (id) {
        try {
            const item = await request(this.base_url + id);

            if (item && item.person) {
                this.fillItem(item.person);
            }
        } catch (e) {
            message.error("Возникла ошибка при получении записи: ", e);
        }
    },
    save: async function (item, setLoading, onRemove, specKey) {
        try {
            const method = item.isCreated ? "POST" : "PUT";

            const data = await request(this.base_url, method, item);

            // Останавливаем спиннер загрузки
            setLoading(false);

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorPerson.createPerson(data.item));
                } else {
                    const people = store.getState().reducerPerson.people;
                    const foundPerson = people.find(person => {
                        return person._id === item._id;
                    });
                    const indexPerson = people.indexOf(foundPerson);

                    if (indexPerson >= 0 && foundPerson) {
                        store.dispatch(ActionCreator.ActionCreatorPerson.editPerson(indexPerson, data.item));
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
            onRemove(specKey, 'remove');
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    cancel: function (onRemove, specKey) {
        onRemove(specKey, 'remove');
    },
    fillItem: function (item) {
        if (!item)
            return;

        const personItem = {
            _id: item._id,
            isCreated: item.isCreated,
            name: item.name,
            notes: item.notes,
            department: item.department,
            profession: item.profession
        };

        store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(personItem));
    }
}