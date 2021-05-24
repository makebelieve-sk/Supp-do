// Методы модели Журнала дефектов и отказов
import {message} from "antd";
import {EquipmentProperty} from "../model/EquipmentProperty";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";
import {NoticeError, storeEquipmentProperties} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";

export const EquipmentPropertyRoute = {
    // Адрес для работы с разделом "Характеристики оборудования"
    base_url: "/api/directory/equipmentProperties/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Характеристики оборудования"
            const items = await request(this.base_url);

            // Записываем полученные записи раздела "Характеристики оборудования" в хранилище
            storeEquipmentProperties(items);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setErrorTableEquipmentProperty("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Получение редактируемой записи
    get: async function (id) {
        try {
            // Получаем редактируемую запись
            const item = await request(this.base_url + id);

            if (typeof item === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setRowDataEquipmentProperty(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("equipmentPropertyItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setErrorRecordEquipmentProperty("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение записи
    save: async function (item, setLoading) {
        try {
            await this.getAll();    // Обновляем все записи раздела

            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            if (typeof data === "string") {
                // Останавливаем спиннер загрузки
                setLoading(false);

                // Обнуляем объект поля "Подразделения" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipmentProperty({
                    key: null,
                    formValues: null
                }));

                // Удаление текущей вкладки
                onRemove("equipmentPropertyItem", "remove");

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.createEquipmentProperty(data.item));
                } else {
                    const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;
                    const foundEquipmentProperty = equipmentProperties.find(equipmentProperty => {
                        return equipmentProperty._id === item._id;
                    });
                    const indexEquipmentProperty = equipmentProperties.indexOf(foundEquipmentProperty);

                    if (indexEquipmentProperty >= 0 && foundEquipmentProperty) {
                        store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.editEquipmentProperty(indexEquipmentProperty, data.item));
                    }
                }

                // Получаем объект поля "Характеристика оборудования", он есть, если мы нажали на "+"
                const replaceField = store.getState().reducerReplaceField.replaceFieldEquipmentProperty;

                if (replaceField.key) {
                    // Обновляем поле
                    setFieldRecord(replaceField, data.item);
                }

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Обнуляем объект поля "Характеристика оборудования" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipmentProperty({
                    key: null,
                    formValues: null,
                    index: null
                }));

                // Удаление текущей вкладки
                onRemove("equipmentPropertyItem", "remove");
            } else {
                // Останавливаем спиннер загрузки
                setLoading(false);

                // Обнуляем объект поля "Характеристика оборудования" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipmentProperty({
                    key: null,
                    formValues: null,
                    index: null
                }));
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setErrorRecordEquipmentProperty("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm) {
        try {
            await this.getAll();    // Обновляем все записи раздела

            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем запись
            const data = await request(this.base_url + _id, "DELETE");

            if (data) {
                // Вывод сообщения
                message.success(data.message);

                const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

                // Удаляем запись из хранилища redux
                let foundEquipmentProperty = equipmentProperties.find(equipmentProperty => {
                    return equipmentProperty._id === _id;
                });
                let indexEquipmentProperty = equipmentProperties.indexOf(foundEquipmentProperty);

                if (foundEquipmentProperty && indexEquipmentProperty >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.deleteEquipmentProperty(indexEquipmentProperty));
                }

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("equipmentPropertyItem", "remove");
            } else {
                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setErrorRecordEquipmentProperty("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Заполнение модели "Характеристики оборудования"
    fillItem: function (item) {
        if (!item.equipmentProperty)
            return;

        // Создаем объект редактируемой записи
        const equipmentPropertyRecord = new EquipmentProperty(item.equipmentProperty);
        equipmentPropertyRecord.isNewItem = item.isNewItem;

        const reduxEquipmentPropertyRecord = store.getState().reducerEquipmentProperty.equipmentProperties;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(equipmentPropertyRecord, reduxEquipmentPropertyRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setRowDataEquipmentProperty(equipmentPropertyRecord));
        }
    }
}