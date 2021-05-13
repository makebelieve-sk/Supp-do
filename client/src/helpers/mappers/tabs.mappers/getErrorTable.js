// Определение ошибки раздела
import {message} from "antd";

/**
 * Функция определения ошибки раздела
 * @param key - ключ выбранного раздела
 * @param stateObject - объект состояния хранилища
 */
export default function getErrorTable(key, stateObject) {
    // Карта соответствия ключа вкладки и ошибки таблицы
    const map = new Map([
        ["professions", stateObject.errorProfession],
        ["departments", stateObject.errorDepartment],
        ["people", stateObject.errorPerson],
        ["tasks", stateObject.errorTask],
        ["equipmentProperties", stateObject.errorEquipmentProperty],
        ["equipment", stateObject.errorEquipment],
        ["logDO", stateObject.errorLogDO],
        ["analytic", stateObject.errorAnalytic],
        ["statistic", stateObject.errorRating || stateObject.errorList],
        ["help", stateObject.errorHelp],
        ["users", stateObject.errorUser],
        ["roles", stateObject.errorRole],
        // ["logs", stateObject.errorLog],
    ]);

    if (map.has(key)) {
        return map.get(key);
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (определение ошибки раздела)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (определение ошибки раздела)`);
    }
};