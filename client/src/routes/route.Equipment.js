// Методы модели Оборудование
import {message} from "antd";

import {Equipment} from "../model/Equipment";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {getParents} from "../helpers/functions/general.functions/replaceField";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";

export const EquipmentRoute = {
    // Адрес для работы с разделом "Оборудование"
    base_url: "/api/directory/equipment/",
    // Адрес для работы с файлами
    file_url: "/files/",
    // Получение всех записей
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все записи разделов "Характеристики оборудования" и "Оборудование"
            const itemsEquipment = await request(this.base_url);
            const itemsEquipmentProperties = await request("/api/directory/equipment-property/");

            // Записываем все записи в хранилище
            if (itemsEquipment && itemsEquipment.length) {
                const reduxItemsEquipment = store.getState().reducerEquipment.equipment;

                const shouldUpdate = compareArrays(itemsEquipment, reduxItemsEquipment);

                if (shouldUpdate) {
                    // Добавление поля nameWithParent
                    itemsEquipment.forEach(item => {
                        if (item.parent) {
                            item.nameWithParent = getParents(item, itemsEquipment) + item.name;
                        }
                    })

                    store.dispatch(ActionCreator.ActionCreatorEquipment.getAllEquipment(itemsEquipment));
                }
            }

            // Записываем все записи в хранилище
            if (itemsEquipmentProperties && itemsEquipmentProperties.length) {
                const reduxItemsEquipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

                const shouldUpdate = compareArrays(itemsEquipment, reduxItemsEquipmentProperties);

                if (shouldUpdate) {
                    store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties(itemsEquipmentProperties));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка при получении оборудования: ", e);
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
    save: async function (item, setLoading, onRemove, equipment) {
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

                // Добавление поля nameWithParent
                if (data.item.parent) {
                    data.item.nameWithParent = getParents(data.item, equipment) + data.item.name;
                }

                // Редактирование записи - изменение записи в хранилище redux,
                // Сохранение записи - создание записи в хранилище redux
                if (method === "POST") {
                    store.dispatch(ActionCreator.ActionCreatorEquipment.createEquipment(data.item));
                } else {
                    const equipment = store.getState().reducerEquipment.equipment;

                    const foundEquipment = equipment.find(eq => eq._id === item._id);
                    const indexEquipment = equipment.indexOf(foundEquipment);

                    if (indexEquipment >= 0 && foundEquipment) {
                        store.dispatch(ActionCreator.ActionCreatorEquipment.editEquipment(indexEquipment, data.item));
                    }
                }

                // Получаем объект поля "Оборудование", он есть, если мы нажали на "+"
                const replaceField = store.getState().reducerReplaceField.replaceFieldEquipment;

                if (replaceField.key) {
                    // Обновляем поле
                    setFieldRecord(replaceField, data.item);
                }
            }

            // Останавливаем спиннер загрузки
            setLoading(false);

            // Обнуляем объект поля "Оборудование" (при нажатии на "+")
            store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipment({
                key: null,
                formValues: null
            }));

            // Удаление текущей вкладки
            onRemove("equipmentItem", "remove");
        } catch (e) {
            console.log(e)
            // Останавливаем спиннер загрузки
            setLoading(false);
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем файлы
            const fileInfo = await request(this.file_url + "delete/" + _id, "DELETE", {model: "equipment"});

            if (fileInfo) {
                // Удаляем запись
                const data = await request(this.base_url + _id, "DELETE");

                if (data) {
                    // Вывод сообщения
                    message.success(data.message);

                    const equipment = store.getState().reducerEquipment.equipment;

                    // Удаляем запись из хранилища redux
                    let foundEquipment = equipment.find(eq => {
                        return eq._id === _id;
                    });
                    let indexEquipment = equipment.indexOf(foundEquipment);

                    if (foundEquipment && indexEquipment >= 0) {
                        store.dispatch(ActionCreator.ActionCreatorEquipment.deleteEquipment(indexEquipment));
                    }
                }

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

                // Удаление текущей вкладки
                onRemove("equipmentItem", "remove");
            }
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: async function (onRemove, setLoadingCancel) {
        try {
            setLoadingCancel(true);

            const fileInfo = await request(this.file_url + "cancel", "DELETE");

            if (fileInfo) {
                setLoadingCancel(false);
                onRemove("equipmentItem", "remove");
            }
        } catch (e) {
            message.error("Возникла ошибка при удалении файлов записи, пожалуйста, удалите файлы вручную");
            setLoadingCancel(false);
        }
    },
    // Заполнение модели "Оборудование"
    fillItem: function (item) {
        if (!item.equipment)
            return;

        // Создаем объект редактируемой записи
        const equipmentRecord = new Equipment(item.equipment);
        equipmentRecord.isNewItem = item.isNewItem;

        // Получаем запись из редакса
        const reduxEquipmentRecord = store.getState().reducerEquipment.equipment;

        // Проверяем полученный с сервера объект и объект из редакса на равенство
        const shouldUpdate = compareObjects(equipmentRecord, reduxEquipmentRecord);

        if (shouldUpdate) {
            // Сохраняем объект редактируемой записи в хранилище
            store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(equipmentRecord));
            store.dispatch(ActionCreator.ActionCreatorEquipment.getAllSelectRows(equipmentRecord.properties));
            store.dispatch(ActionCreator.ActionCreatorEquipment.getAllFiles(equipmentRecord.files));
        }
    }
}