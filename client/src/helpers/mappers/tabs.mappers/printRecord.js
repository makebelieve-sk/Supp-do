// Карта соответствия ключа раздела и наименования/данных записи
import {message} from "antd";

import store from "../../../redux/store";

// Карта соответствия ключей и наименования/данных записи
const map = new Map([
    ["equipmentItem", {
        title: "Печать записи перечня оборудования",
        getPrintData: () => store.getState().reducerEquipment.rowDataEquipment
    }],
    ["logDOItem", {
        title: "Печать записи журнала дефектов и отказов",
        getPrintData: () => store.getState().reducerLogDO.rowDataLogDO
    }],
]);

/**
 * Функция наименования файла и данных для печати записи
 * @param key - ключ раздела записи
 * @returns объект с наименоваием файла и данными для печати записи
 */
export const getPrintRecord = (key) => {
    if (map.has(key)) {
        return {
            name: map.get(key).getPrintName,
            getRecord: map.get(key).getPrintData,
        };
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (печать записи)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (печать записи)`);
    }
};