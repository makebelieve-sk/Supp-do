// Модель для справочника Характеристики оборудования
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../components/helpers/request.helper";

export const EquipmentProperty = {
    base_url: "/api/directory/equipment-property/",
    getAll: async function (setLoading) {
        try {
            const items = await request(this.base_url);

            if (items) {
                store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.getAllEquipmentProperties(items));
            }
        } catch (e) {
            message.error("Возникла ошибка при получении характеристик оборудования: ", e);
            setLoading(false);
        }
    },
    get: async function (id) {
        try {
            const item = await request(this.base_url + id);

            if (item && item.equipmentProperty) {
                this.fillItem(item.equipmentProperty);
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

        const equipmentPropertyItem = {
            _id: item._id,
            isCreated: item.isCreated,
            name: item.name,
            notes: item.notes
        };

        store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setRowDataEquipmentProperty(equipmentPropertyItem));
    }
}