// Методы модели "Профессии"
import {message} from "antd";

import {Profession} from "../model/Profession";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";
import {NoticeError, storeProfessions} from "./helper";

export const ProfessionRoute = {
    // Адрес для работы с разделом "Профессии"
    base_url: "/api/directory/professions/",
    // Получение всех профессий
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Профессии"
            const items = await request(this.base_url);

            // Записываем полученные записи раздела "Профессии" в хранилище
            storeProfessions(items);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorProfession.setErrorTable("Возникла ошибка при получении записей: " + e));
            NoticeError.getAll(e); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой профессии
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorPerson.setErrorRecord("Возникла ошибка при получении записи: " + e));
            NoticeError.get(e); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение профессии
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
                    store.dispatch(ActionCreator.ActionCreatorProfession.createProfession(data.item));
                } else {
                    const professions = store.getState().reducerProfession.professions;

                    const foundProfession = professions.find(profession => profession._id === item._id);
                    const indexProfession = professions.indexOf(foundProfession);

                    if (indexProfession >= 0 && foundProfession) {
                        store.dispatch(ActionCreator.ActionCreatorProfession.editProfession(indexProfession, data.item));
                    }
                }

                // Получаем объект поля "Профессии", он есть, если мы нажали на "+"
                const replaceField = store.getState().reducerReplaceField.replaceFieldProfession;

                if (replaceField.key) {
                    // Обновляем поле
                    setFieldRecord(replaceField, data.item);
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Обнуляем объект поля "Профессии" (при нажатии на "+")
            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldProfession({
                key: null,
                formValues: null
            }));

            // Удаление текущей вкладки
            this.cancel(onRemove);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorProfession.setErrorRecord("Возникла ошибка при сохранении записи: " + e));
            NoticeError.save(e, setLoading);    // Вызываем функцию обработки ошибки
        }

    },
    // Удаление профессии
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                // Получаем список профессий из хранилища
                const professions = store.getState().reducerProfession.professions;

                // Удаляем запись из хранилища redux
                const foundProfession = professions.find(profession => profession._id === _id);
                const indexProfession = professions.indexOf(foundProfession);

                if (foundProfession && indexProfession >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorProfession.deleteProfession(indexProfession));
                }
            }

            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);

            // Удаление текущей вкладки
            this.cancel(onRemove)
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorProfession.setErrorRecord("Возникла ошибка при удалении записи: " + e));
            NoticeError.delete(e, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }

    },
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove) {
        // Удаление текущей вкладки
        onRemove("professionItem", "remove");
    },
    // Заполнение модели "Профессия"
    fillItem: function (item) {
        if (!item.profession)
            return;

        // Создаем объект редактируемой записи
        const professionRecord = new Profession(item.profession);
        professionRecord.isNewItem = item.isNewItem;

        const reduxProfessionRecord = store.getState().reducerProfession.rowDataProfession;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(professionRecord, reduxProfessionRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorProfession.setRowDataProfession(professionRecord));
        }
    }
}