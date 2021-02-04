// Помощник для работы с DataTable
import {
    headerProfessionTable,
    headerDepartmentTable,
    headerPersonTable,
    headerTasksTable,
    headerEquipmentPropertyTable,

    DepartmentColumns,
    PersonColumns,
    ProfessionColumns,
    TasksColumns,
    EquipmentPropertyColumns
} from "../../datatable.options/datatable.columns";
import {getProfession, getDepartment, getPerson, getTask, getEquipmentProperty} from "./rowFunctions.helper";
import {message} from "antd";

// Карта соответсвия ключей и строк, колонок и заголовков экспорта
const map = new Map([
    ['professions', {getRow: getProfession, getColumns: ProfessionColumns, getExportHeaders: headerProfessionTable}],
    ['departments', {getRow: getDepartment, getColumns: DepartmentColumns, getExportHeaders: headerDepartmentTable}],
    ['people', {getRow: getPerson, getColumns: PersonColumns, getExportHeaders: headerPersonTable}],
    ['tasks', {getRow: getTask, getColumns: TasksColumns, getExportHeaders: headerTasksTable}],
    ['equipmentProperties', {getRow: getEquipmentProperty, getColumns: EquipmentPropertyColumns, getExportHeaders: headerEquipmentPropertyTable}],
]);

/**
 * Создание мапы соответствия для функций открытия/редактирования вкладок
 * @param key - ключ для поиска компонента, добавляемого во вкладку
 * @param add - функция для созданя новой вкладки
 * @param tabs - текущий массив вкладок
 * @param request - функция запроса
 * @param row - редактируемая строка
 * @constructor
 */
const RowMapHelper = (key, add, tabs, request, row) => {
    if (map.has(key)) {
        map.get(key).getRow(add, tabs, request, row);
    } else {
        message.error(`Раздел с ключём ${key} не существует (создание строк)`).then(r => console.log(r));
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
            .then(r => console.log(r));
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
            .then(r => console.log(r));
    }
};

export {
    RowMapHelper,
    ColumnsMapHelper,
    ExportMapHelper
}