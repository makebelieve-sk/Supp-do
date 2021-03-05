// Методы модели Профессии
import {request} from "../components/helpers/request.helper";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {message} from "antd";
import {Profession} from "../model/Profession";

export const ProfessionRoute = {
    base_url: "/api/directory/professions/",
    getAll: async function () {
        try {
            const items = await request(this.base_url);

            if (items) {
                store.dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(items));
            }
        } catch (e) {
            message.error("Возникла ошибка при получении профессий: ", e);
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
                    store.dispatch(ActionCreator.ActionCreatorProfession.createProfession(data.item));
                } else {
                    const professions = store.getState().reducerProfession.professions;
                    const foundProfession = professions.find(profession => {
                        return profession._id === item._id;
                    });
                    const indexProfession = professions.indexOf(foundProfession);

                    if (indexProfession >= 0 && foundProfession) {
                        store.dispatch(ActionCreator.ActionCreatorProfession.editProfession(indexProfession, data.item));
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

                const professions = store.getState().reducerProfession.professions;

                // Удаляем запись из хранилища redux
                let foundProfession = professions.find(profession => {
                    return profession._id === _id;
                });
                let indexProfession = professions.indexOf(foundProfession);

                if (foundProfession && indexProfession >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorProfession.deleteProfession(indexProfession));
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
        // Удаление текущей вкладки
        onRemove(specKey, 'remove');
    },
    fillItem: function (item) {
        if (!item.profession)
            return;

        let professionItem = new Profession(item);
        professionItem.isNewItem = item.isNewItem;

        store.dispatch(ActionCreator.ActionCreatorProfession.setRowDataProfession(professionItem));
    }
}