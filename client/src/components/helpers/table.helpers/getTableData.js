// Получение данных для таблицы
import {message} from "antd";

import store from "../../../redux/store";
import {createTreeData} from "./createTreeData.helper";

/**
 * Фукнция получения данных для таблицы
 * @param key - ключ раздела
 * @returns Возвращает массив записей таблицы
 */
export default function getTableData(key) {
    // Создание карты соответствия ключа раздела и массивов записей таблиц
    const map = new Map([
        ["professions", store.getState().reducerProfession.professions],
        ["departments", createTreeData(store.getState().reducerDepartment.departments)],
        ["people", store.getState().reducerPerson.people],
        ["tasks", store.getState().reducerTask.tasks],
        ["equipmentProperties", store.getState().reducerEquipmentProperty.equipmentProperties],
        ["equipment", createTreeData(store.getState().reducerEquipment.equipment)],
        ["logDO", store.getState().reducerLogDO.logDO]
    ]);

    if (map.has(key)) {
        return map.get(key);
    } else {
        message.error(`Раздел с ключём ${key} не существует (заполнение таблицы данными)`)
            .then(null);
    }
}