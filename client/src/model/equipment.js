// Модель для справочника Перечень оборудования
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";
import {EquipmentProperty} from "./EquipmentProperty";
import getParents from "../components/helpers/getRowParents.helper";

export const Equipment = {
    base_url: "/api/directory/equipment/",
    file_url: "/files/",
    getAll: async function () {
        try {
            const itemsEquipmentProperty = await request(EquipmentProperty.base_url);
            const itemsEquipment = await request(this.base_url);

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
        } catch (e) {
            message.error("Возникла ошибка при получении оборудования: ", e);
        }
    },
    get: async function (id) {
        try {
            const item = await request(this.base_url + id);

            if (item && item.equipment) {
                this.fillItem(item.equipment);
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
    fillItem: function (item) {
        if (!item)
            return;

        const equipmentItem = {
            _id: item._id,
            isCreated: item.isCreated,
            name: item.name,
            notes: item.notes,
            parent: item.parent,
            properties: item.properties,
            files: item.files
        };

        store.dispatch(ActionCreator.ActionCreatorEquipment.setRowDataEquipment(equipmentItem));
        store.dispatch(ActionCreator.ActionCreatorEquipment.getAllSelectRows(equipmentItem.properties));
        store.dispatch(ActionCreator.ActionCreatorEquipment.getAllFiles(equipmentItem.files));
    }
}