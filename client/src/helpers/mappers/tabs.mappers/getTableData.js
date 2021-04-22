// Получение данных для таблицы
import {message} from "antd";

import {createTreeData} from "../../functions/general.functions/createTreeData.helper";

/**
 * Фукнция получения данных для таблицы
 * @param key - ключ раздела
 * @param dataStore - данные раздела
 * @returns Возвращает массив записей таблицы
 */
export default function getTableData(key, dataStore) {
    // Создание карты соответствия ключа раздела и массивов записей таблиц
    const map = new Map([
        ["professions", dataStore],
        ["departments", createTreeData(dataStore)],
        ["people", dataStore],
        ["tasks", dataStore],
        ["equipmentProperties", dataStore],
        ["equipment", createTreeData(dataStore)],
        ["logDO", dataStore],
        ["help", dataStore],
        ["users", dataStore],
        ["roles", dataStore],
    ]);

    if (map.has(key)) {
        return map.get(key);
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (заполнение таблицы данными)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (заполнение таблицы данными)`);
    }
}