// Помощник для создания вкладки
import {
    getContentDepartment,
    getContentEquipmentProperty,
    getContentPerson,
    getContentProfession,
    getContentTaskStatus
} from "./contentFunctions.helper";

import {message} from "antd";

// Карта соответствия ключ-функция
const sectionSelector = new Map([
    ['professions', getContentProfession],
    ['departments', getContentDepartment],
    ['people', getContentPerson],
    ['tasks', getContentTaskStatus],
    ['equipmentProperties', getContentEquipmentProperty],
]);

/**
 * Создание соответствия ключа и функции, размещающей UI-компонент во вкладке
 * @param key - ключ для поиска компонента, добавляемого во вкладку
 * @param add - функция для созданя новой вкладки
 * @param request - функция запроса
 * @param tabs - текущий массив вкладок
 * @constructor
 */
const OpenSectionContentHelper = (key, add, request, tabs) => {
    if (sectionSelector.has(key)) {
        sectionSelector.get(key)(add, request, tabs);
    } else {
        let errorText = `Раздел с ключём ${key} не существует`;
        message.error(errorText).then(r => console.log(r));
    }
};

export {
    OpenSectionContentHelper
}