// Помощник для работы с таблицей (записи, колонки, экспорт)
import {message} from "antd";

import {
    ProfessionColumns,
    DepartmentColumns,
    PersonColumns,
    TasksColumns,
    EquipmentPropertyColumns,
    EquipmentColumns,
    LogDOColumns,
} from "../../../options/tab.options/table.options/columns";

import {
    headerProfession,
    headerDepartment,
    headerPerson,
    headerTasks,
    headerEquipmentProperty,
    headerEquipment,
    headerLogDO,
} from "../../../options/tab.options/table.options/exportHeaders";

import {ProfessionRoute} from "../../../routes/route.profession";
import {DepartmentRoute} from "../../../routes/route.Department";
import {PersonRoute} from "../../../routes/route.Person";
import {TaskStatusRoute} from "../../../routes/route.taskStatus";
import {EquipmentPropertyRoute} from "../../../routes/route.EquipmentProperty";
import {EquipmentRoute} from "../../../routes/route.Equipment";
import {LogDORoute} from "../../../routes/route.LogDO";

import {ProfessionTab} from "../../../tabs/profession/profession.edit";
import {DepartmentTab} from "../../../tabs/department/department.edit";
import {PersonTab} from "../../../tabs/person/person.edit";
import {TaskTab} from "../../../tabs/taskStatus/taskStatus.edit";
import {EquipmentPropertyTab} from "../../../tabs/equipmentProperty/equipmentProperty.edit";
import {EquipmentTab} from "../../../tabs/equipment/equipment.edit";
import {LogDOTab} from "../../../tabs/logDo/logDO.edit";

import openRecord from "../../functions/tabs.functions/openRecordTab";
import store from "../../../redux/store";

// Карта соответствия ключей и вкладок, колонок и заголовков экспорта
const map = new Map([
    ["professions", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание профессии",
            "Редактирование профессии",
            ProfessionTab,
            "professionItem",
            ProfessionRoute
        ),
        getColumns: ProfessionColumns,
        getTableHeader: headerProfession,
        getPrintName: "Профессии",
        getPrintData: () => store.getState().reducerProfession.professions
    }],
    ["departments", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание подразделения",
            "Редактирование подразделения",
            DepartmentTab,
            "departmentItem",
            DepartmentRoute
        ),
        getColumns: DepartmentColumns,
        getTableHeader: headerDepartment,
        getPrintName: "Подразделения",
        getPrintData: () => store.getState().reducerDepartment.departments
    }],
    ["people", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи о сотруднике",
            "Редактирование записи о сотруднике",
            PersonTab,
            "personItem",
            PersonRoute
        ),
        getColumns: PersonColumns,
        getTableHeader: headerPerson,
        getPrintName: "Персонал",
        getPrintData: () => store.getState().reducerPerson.people
    }],
    ["tasks", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи о состоянии заявки",
            "Редактирование записи о состоянии заявки",
            TaskTab,
            "taskStatusItem",
            TaskStatusRoute
        ),
        getColumns: TasksColumns,
        getTableHeader: headerTasks,
        getPrintName: "Состояния заявок",
        getPrintData: () => store.getState().reducerTask.tasks
    }],
    ["equipmentProperties", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи о характеристике оборудования",
            "Редактирование записи о характеристике оборудования",
            EquipmentPropertyTab,
            "equipmentPropertyItem",
            EquipmentPropertyRoute
        ),
        getColumns: EquipmentPropertyColumns,
        getTableHeader: headerEquipmentProperty,
        getPrintName: "Характеристики оборудования",
        getPrintData: () => store.getState().reducerEquipmentProperty.equipmentProperties
    }],
    ["equipment", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи об объекте оборудования",
            "Редактирование записи об объекте оборудования",
            EquipmentTab,
            "equipmentItem",
            EquipmentRoute
        ),
        getColumns: EquipmentColumns,
        getTableHeader: headerEquipment,
        getPrintName: "Перечень оборудования",
        getPrintData: () => store.getState().reducerEquipment.equipment
    }],
    ["logDO", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи в журнале дефектов и отказов",
            "Редактирование записи в журнале дефектов и отказов",
            LogDOTab,
            "logDOItem",
            LogDORoute
        ),
        getColumns: LogDOColumns,
        getTableHeader: headerLogDO,
        getPrintName: "Журнал дефектов и отказов",
        getPrintData: () => store.getState().reducerLogDO.logDO
    }],
]);

/**
 * Функция открытия вкладки записи
 * @param key - ключ вкладки записи
 * @param _id - id редактируемой строки
 * @constructor
 */
const openRecordTab = (key, _id) => {
    if (map.has(key)) {
        map.get(key).openRecordTab(_id).then(null);
    } else {
        message.error(`Раздел с ключём ${key} не существует (открытие вкладки редактирования записи)`)
            .then(null);
    }
};

/**
 * Фукнция получения колонок таблицы
 * @param key - ключ раздела
 * @returns массив колонок
 * @constructor
 */
const getColumns = (key) => {
    if (map.has(key)) {
        return map.get(key).getColumns;
    } else {
        message.error(`Раздел с ключём ${key} не существует (создание колонок)`).then(null);
    }
};

/**
 * Функция получения шапки таблицы
 * @param key - ключ таблицы
 * @returns строку шапки таблицы
 * @constructor
 */
const getTableHeader = (key) => {
    if (map.has(key)) {
        return map.get(key).getTableHeader;
    } else {
        message.error(`Раздел с ключём ${key} не существует (создание заголовков экспорта)`).then(null);
    }
};

/**
 * Функция наименования файла и данных для печати таблицы
 * @param key - ключ таблицы
 * @returns объект с наименоваием файла и данными для печати таблицы
 */
const getPrintTable = (key) => {
    if (map.has(key)) {
        return {
            name: map.get(key).getPrintName,
            getData: map.get(key).getPrintData,
        };
    } else {
        message.error(`Раздел с ключём ${key} не существует (создание заголовков экспорта)`).then(null);
    }
};

export {openRecordTab, getColumns, getTableHeader, getPrintTable}