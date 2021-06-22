// Методы модели "Оборудование"
import {message} from "antd";

import {Equipment} from "../model/Equipment";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {getParents} from "../helpers/functions/general.functions/replaceField";
import {compareObjects} from "../helpers/functions/general.functions/compare";
import setFieldRecord from "../helpers/mappers/general.mappers/setFieldRecord";
import {NoticeError, storeEquipment, storeEquipmentProperties} from "./helper";
import onRemove from "../helpers/functions/general.functions/removeTab";

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
            const data = await request(this.base_url);

            // Записываем полученные записи раздела "Оборудование" в хранилище
            storeEquipment(data.items);

            // Записываем полученные записи раздела "Характеристики оборудования" в хранилище
            storeEquipmentProperties(data.equipmentProperties);

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipment.setErrorTableEquipment("Возникла ошибка при получении записей: " + e.message));
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
                store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(null));

                await this.getAll();    // Обновляем записи раздела

                onRemove("equipmentItem", "remove")  // Удаляем открытую вкладку

                return null;
            }

            // Заполняем модель записи
            if (item) this.fillItem(item);
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipment.setErrorRecordEquipment("Возникла ошибка при получении записи: " + e.message));
            NoticeError.get(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Сохранение записи
    save: async function (item, setLoading, equipment) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isNewItem ? "POST" : "PUT";

            // Получаем сохраненную запись
            const data = await request(this.base_url, method, item);

            // Если в ответе есть массив errors
            if (data && data.errors && data.errors.length) {
                message.error(data.errors[0].msg);

                // Останавливаем спиннер загрузки
                setLoading(false);

                return null;
            }

            // Если вернулась ошибка 404 (запись не найдена)
            if (typeof data === "string") {
                // Обнуляем редактируемую запись
                store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(null));

                await this.getAll();    // Обновляем все записи раздела

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("equipmentItem", "remove");

                return null;
            }

            if (data) {
                // Выводим сообщение от сервера
                message.success(data.message);

                // Добавление поля nameWithParent
                if (data.item.parent) {
                    data.item.nameWithParent = getParents(data.item, equipment) + data.item.name;
                }

                // Сохранение записи - обновляем redux
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

                // Обновляем поле записи
                if (replaceField.key) setFieldRecord(replaceField, data.item);

                // Обнуляем объект поля "Оборудование" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipment({
                    key: null,
                    formValues: null
                }));

                // Останавливаем спиннер загрузки
                setLoading(false);

                // Удаление текущей вкладки
                onRemove("equipmentItem", "remove");
            } else {
                // Обнуляем объект поля "Оборудование" (при нажатии на "+")
                store.dispatch(ActionCreator.ActionCreatorReplaceField.setReplaceFieldEquipment({
                    key: null,
                    formValues: null
                }));

                // Останавливаем спиннер загрузки
                setLoading(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipment.setErrorRecordEquipment("Возникла ошибка при сохранении записи: " + e.message));
            NoticeError.save(e.message, setLoading);    // Вызываем функцию обработки ошибки
        }
    },
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем файлы
            const fileInfo = await request(this.file_url + "delete/" + _id, "DELETE", {model: "equipment"});

            if (fileInfo) {
                // Удаляем запись
                const data = await request(this.base_url + _id, "DELETE");

                // Если вернулась ошибка 404 (запись не найдена)
                if (typeof data === "string") {
                    await this.getAll();    // Обновляем все записи раздела

                    // Обнуляем редактируемую запись
                    store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(null));

                    // Останавливаем спиннер, и скрываем всплывающее окно
                    setLoadingDelete(false);
                    setVisiblePopConfirm(false);

                    // Удаление текущей вкладки
                    onRemove("equipmentItem", "remove");

                    return null;
                }

                if (data) {
                    // Вывод сообщения
                    message.success(data.message);

                    const equipment = store.getState().reducerEquipment.equipment;

                    // Удаляем запись из хранилища redux
                    const foundEquipment = equipment.find(eq => eq._id === _id);
                    const indexEquipment = equipment.indexOf(foundEquipment);

                    if (foundEquipment && indexEquipment >= 0) {
                        store.dispatch(ActionCreator.ActionCreatorEquipment.deleteEquipment(indexEquipment));
                    }

                    // Обнуляем редактируемую запись
                    store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(null));

                    // Останавливаем спиннер, и скрываем всплывающее окно
                    setLoadingDelete(false);
                    setVisiblePopConfirm(false);

                    // Удаление текущей вкладки
                    onRemove("equipmentItem", "remove");
                } else {
                    // Останавливаем спиннер, и скрываем всплывающее окно
                    setLoadingDelete(false);
                    setVisiblePopConfirm(false);
                }
            } else {
                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);
            }
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipment.setErrorRecordEquipment("Возникла ошибка при удалении записи: " + e.message));
            NoticeError.delete(e.message, setLoadingDelete, setVisiblePopConfirm);    // Вызываем функцию обработки ошибки
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: async function (setLoadingCancel) {
        try {
            setLoadingCancel(true);

            const fileInfo = await request(this.file_url + "cancel", "DELETE");

            if (fileInfo) {
                setLoadingCancel(false);
                onRemove("equipmentItem", "remove");
            } else {
                setLoadingCancel(false);
            }
        } catch (e) {
            setLoadingCancel(false);
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorEquipment.setErrorRecordEquipment("Возникла ошибка при удалении добавленных файлов из записи: " + e.message));
            NoticeError.cancel(e.message);    // Вызываем функцию обработки ошибки
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