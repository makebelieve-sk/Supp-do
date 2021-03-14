// Методы модели "Профессии"
import {request} from "../components/helpers/request.helper";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {message} from "antd";
import {Profession} from "../model/Profession";
import setFieldRecord from "../components/helpers/tab.helpers/setFieldRecord";

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

            if (items) {
                // Записываем все профессии в хранилище
                store.dispatch(ActionCreator.ActionCreatorProfession.getAllProfessions(items));
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении профессий: ", e);
        }
    },
    // Получение редактируемой профессии
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
    // Сохранение профессии
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

                // Изменение поля редактируемой записи
                const prevActiveTab = store.getState().reducerTab.prevActiveTab;

                if (prevActiveTab === "personItem" || prevActiveTab === "logDOItem") {
                    setFieldRecord(prevActiveTab, data.item);
                }
            }

            // Удаление текущей вкладки
            onRemove(specKey, "remove");
        } catch (e) {
            // Останавливаем спиннер загрузки
            setLoading(false);
        }

    },
    // Удаление профессии
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

                // Получаем список профессий из хранилища
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
    // Нажатие на кнопку "Отмена"
    cancel: function (onRemove, specKey) {
        // Удаление текущей вкладки
        onRemove(specKey, 'remove');
    },
    // Заполнение модели "Профессия"
    fillItem: function (item) {
        if (!item.profession)
            return;

        // Создаем объект редактируемой записи
        let professionItem = new Profession(item.profession);
        professionItem.isNewItem = item.isNewItem;

        // Сохраняем объект редактируемой записи в хранилище
        store.dispatch(ActionCreator.ActionCreatorProfession.setRowDataProfession(professionItem));
    }
}