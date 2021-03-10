// Методы модели Оборудование
import {message} from "antd";

import {Equipment} from "../model/Equipment";
import {EquipmentPropertyRoute} from "./route.EquipmentProperty";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import getParents from "../components/helpers/getRowParents.helper";

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

            // Получаем все записи разделов "Оборудование" и "Характеристики оборудования"
            const itemsEquipmentProperty = await request(EquipmentPropertyRoute.base_url);
            const itemsEquipment = await request(this.base_url);

            // Записываем все записи в хранилище
            if (itemsEquipmentProperty) {
                store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties(itemsEquipmentProperty));
            }

            if (itemsEquipment && itemsEquipment.length) {
                itemsEquipment.forEach(item => {
                    if (item.parent) {
                        item.nameWithParent = getParents(item, itemsEquipment) + item.name;
                    }
                })

                store.dispatch(ActionCreator.ActionCreatorEquipment.getAllEquipment(itemsEquipment));
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
    save: async function (item, setLoading, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoading(true);

            // Устанавливаем метод запроса
            const method = item.isCreated ? "POST" : "PUT";

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
                    store.dispatch(ActionCreator.ActionCreatorEquipment.createEquipment(data.item));
                } else {
                    const equipment = store.getState().reducerEquipment.equipment;
                    const foundEquipment = equipment.find(eq => {
                        return eq._id === item._id;
                    });
                    const indexEquipment = equipment.indexOf(foundEquipment);

                    if (indexEquipment >= 0 && foundEquipment) {
                        store.dispatch(ActionCreator.ActionCreatorEquipment.editEquipment(indexEquipment, data.item));
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
    // Удаление записи
    delete: async function (_id, setLoadingDelete, setVisiblePopConfirm, onRemove, specKey) {
        try {
            // Устанавливаем спиннер загрузки
            setLoadingDelete(true);

            // Удаляем файлы
            const fileInfo = await request(this.file_url + "delete/" + _id, "DELETE", {model: "equipment"});

            if (fileInfo) {
                // Удаляем запись
                const data = await request(this.base_url + _id, "DELETE");

                // Останавливаем спиннер, и скрываем всплывающее окно
                setLoadingDelete(false);
                setVisiblePopConfirm(false);

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

                // Удаление текущей вкладки
                onRemove(specKey, 'remove');
            }
        } catch (e) {
            // Останавливаем спиннер, и скрываем всплывающее окно
            setLoadingDelete(false);
            setVisiblePopConfirm(false);
        }
    },
    // Нажатие на кнопку "Отмена"
    cancel: async function (onRemove, specKey, setLoadingCancel) {
        try {
            setLoadingCancel(true);

            const fileInfo = await request(this.file_url + "cancel", "DELETE");

            if (fileInfo) {
                setLoadingCancel(false);
                onRemove(specKey, 'remove');
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
        let equipmentItem = new Equipment(item.equipment);
        equipmentItem.isNewItem = item.isNewItem;

        // Сохраняем объект редактируемой записи в хранилище
        store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(equipmentItem));
        store.dispatch(ActionCreator.ActionCreatorEquipment.getAllSelectRows(equipmentItem.properties));
        store.dispatch(ActionCreator.ActionCreatorEquipment.getAllFiles(equipmentItem.files));
    }
}