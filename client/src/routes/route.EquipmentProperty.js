// Методы модели Журнала дефектов и отказов
import {message} from "antd";
import {EquipmentProperty} from "../model/EquipmentProperty";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";

export const EquipmentPropertyRoute = {
    // Адрес для работы с разделом "Характеристики оборудования"
    base_url: "/api/directory/equipment-property/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи раздела "Характеристики оборудования"
            const items = await request(this.base_url);

            if (items) {
                const reduxEquipmentProperty = store.getState().reducerEquipmentProperty.equipmentProperties;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxEquipmentProperty);

                if (shouldUpdate) {
                    // Записываем все записи в хранилище
                    store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении характеристик оборудования: ", e);
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
            this.cancel(onRemove);
        } catch (e) {
            // Останавливаем спиннер загрузки
            setLoading(false);
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

                const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

                // Удаляем запись из хранилища redux
                let foundEquipmentProperty = equipmentProperties.find(equipmentProperty => {
                    return equipmentProperty._id === _id;
                });
                let indexEquipmentProperty = equipmentProperties.indexOf(foundEquipmentProperty);

                if (foundEquipmentProperty && indexEquipmentProperty >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.deleteEquipmentProperty(indexEquipmentProperty));
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
        onRemove("equipmentPropertyItem", "remove");
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