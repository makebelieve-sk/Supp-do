// Помощник для работы с DataTable (записи, колонки, экспорт)
import {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    headerTasksTable,
    headerEquipmentPropertyTable,
    headerEquipmentTable,
    headerLogDOTable,

    DepartmentColumns,
    PersonColumns,
    ProfessionColumns,
    TasksColumns,
    EquipmentPropertyColumns,
    EquipmentColumns,
    LogDOColumns,
} from "../../../options/table.options/datatable.columns";

import {
    getProfession,
    getDepartment,
    getPerson,
    getTask,
    getEquipmentProperty,
    getEquipment,
    getLogDO
} from "./tableTab.helper";

import {message} from "antd";

// Карта соответствия ключей и строк, колонок и заголовков экспорта
const map = new Map([
    ["professions", {getRow: getProfession, getColumns: ProfessionColumns, getExportHeaders: headerProfessionTable}],
    ["departments", {getRow: getDepartment, getColumns: DepartmentColumns, getExportHeaders: headerDepartmentTable}],
    ["people", {getRow: getPerson, getColumns: PersonColumns, getExportHeaders: headerPersonTable}],
    ["tasks", {getRow: getTask, getColumns: TasksColumns, getExportHeaders: headerTasksTable}],
    ["equipmentProperties", {getRow: getEquipmentProperty, getColumns: EquipmentPropertyColumns, getExportHeaders: headerEquipmentPropertyTable}],
    ["equipment", {getRow: getEquipment, getColumns: EquipmentColumns, getExportHeaders: headerEquipmentTable}],
    ["logDO", {getRow: getLogDO, getColumns: LogDOColumns, getExportHeaders: headerLogDOTable}],
]);

/**
 * Создание мапы соответствия для функций открытия/редактирования вкладок
 * @param key - ключ для поиска компонента, добавляемого во вкладку
 * @param _id - id строчки
 * @constructor
 */
const RowMapHelper = (key, _id) => {
    if (map.has(key)) {
        map.get(key).getRow(_id).then(null);
    } else {
        message.error(`Раздел с ключём ${key} не существует (открытие вкладки создания/редактирования записи)`)
            .then(null);
    }
};

/**
 * Создание мапы соответствия передаваемого ключа и колонок таблицы
 * @param key - ключ раздела
 * @returns массив колонок
 * @constructor
 */
const ColumnsMapHelper = (key) => {
    if (map.has(key)) {
        return map.get(key).getColumns;
    } else {
        message.error(`Раздел с ключём ${key} не существует (создание колонок)`)
            .then(null);
    }
};

/**
 * Создание мапы соответствия ключей и заголовков таблицы для экспорта
 * @param key - ключ раздела
 * @returns строку заголовка таблицы
 * @constructor
 */
const ExportMapHelper = (key) => {
    if (map.has(key)) {
        return map.get(key).getExportHeaders;
    } else {
        message.error(`Раздел с ключём ${key} не существует (создание заголовков экспорта)`)
            .then(null);
    }
};

export {RowMapHelper, ColumnsMapHelper, ExportMapHelper}