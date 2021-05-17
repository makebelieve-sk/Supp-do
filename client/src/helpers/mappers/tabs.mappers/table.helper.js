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
    HelpColumns,
    UserColumns,
    RoleColumns,
    StatisticRatingColumns,
    StatisticListColumns,
    LogColumns,
} from "../../../options/tab.options/table.options/columns";

import {
    headerProfession,
    headerDepartment,
    headerPerson,
    headerTasks,
    headerEquipmentProperty,
    headerEquipment,
    headerLogDO,
    headerHelp,
    headerUser,
    headerRole,
    headerStatisticRating,
    headerStatisticList,
    headerLog,
} from "../../../options/tab.options/table.options/exportHeaders";

import {ProfessionRoute} from "../../../routes/route.profession";
import {DepartmentRoute} from "../../../routes/route.Department";
import {PersonRoute} from "../../../routes/route.Person";
import {TaskStatusRoute} from "../../../routes/route.taskStatus";
import {EquipmentPropertyRoute} from "../../../routes/route.EquipmentProperty";
import {EquipmentRoute} from "../../../routes/route.Equipment";
import {LogDORoute} from "../../../routes/route.LogDO";
import {HelpRoute} from "../../../routes/route.Help";
import {RoleRoute} from "../../../routes/route.Role";
import {UserRoute} from "../../../routes/route.User";
import {AnalyticRoute} from "../../../routes/route.Analytic";
import {StatisticRatingRoute} from "../../../routes/route.StatisticRating";
import {StatisticListRoute} from "../../../routes/route.StatisticList";
import {LogRoute} from "../../../routes/route.Log";

import {ProfessionTab} from "../../../tabs/profession/profession.edit";
import {DepartmentTab} from "../../../tabs/department/department.edit";
import {PersonTab} from "../../../tabs/person/person.edit";
import {TaskTab} from "../../../tabs/taskStatus/taskStatus.edit";
import {EquipmentPropertyTab} from "../../../tabs/equipmentProperty/equipmentProperty.edit";
import {EquipmentTab} from "../../../tabs/equipment/equipment.edit";
import {LogDOTab} from "../../../tabs/logDo/logDO.edit";
import {HelpTab} from "../../../tabs/help/help";
import {UserTab} from "../../../tabs/user/user";
import {RoleTab} from "../../../tabs/role/role";
import {LogTab} from "../../../tabs/log/log";

import store from "../../../redux/store";
import openRecord from "../../functions/tabs.functions/openRecordTab";

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
        getPrintData: () => store.getState().reducerProfession.professions,
        getExportName: "Профессии",
        model: ProfessionRoute
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
        getPrintData: () => store.getState().reducerDepartment.departments,
        getExportName: "Подразделения",
        model: DepartmentRoute
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
        getPrintData: () => store.getState().reducerPerson.people,
        getExportName: "Персонал",
        model: PersonRoute
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
        getPrintData: () => store.getState().reducerTask.tasks,
        getExportName: "Состояния заявок",
        model: TaskStatusRoute
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
        getPrintData: () => store.getState().reducerEquipmentProperty.equipmentProperties,
        getExportName: "Характеристики оборудования",
        model: EquipmentPropertyRoute
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
        getPrintData: () => store.getState().reducerEquipment.equipment,
        getExportName: "Перечень оборудования",
        model: EquipmentRoute
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
        getPrintData: () => store.getState().reducerLogDO.logDO,
        getExportName: "Журнал дефектов и отказов",
    }],
    ["help", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи помощи",
            "Редактирование записи помощи",
            HelpTab,
            "helpItem",
            HelpRoute
        ),
        getColumns: HelpColumns,
        getTableHeader: headerHelp,
        getPrintName: "Помощь",
        getPrintData: () => store.getState().reducerHelp.help,
        getExportName: "Помощь",
        model: UserRoute
    }],
    ["users", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание пользователя",
            "Редактирование пользователя",
            UserTab,
            "userItem",
            UserRoute
        ),
        getColumns: UserColumns,
        getTableHeader: headerUser,
        getPrintName: "Пользователи",
        getPrintData: () => store.getState().reducerUser.users,
        getExportName: "Пользователи",
        model: UserRoute
    }],
    ["roles", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание роли",
            "Редактирование роли",
            RoleTab,
            "roleItem",
            RoleRoute
        ),
        getColumns: RoleColumns,
        getTableHeader: headerRole,
        getPrintName: "Роли",
        getPrintData: () => store.getState().reducerRole.roles,
        getExportName: "Роли",
        model: RoleRoute
    }],
    ["analytic", {model: AnalyticRoute}],
    ["statisticRating", {
        getColumns: StatisticRatingColumns,
        getTableHeader: headerStatisticRating,
        getPrintName: "Статистика/Рейтинг отказов",
        getPrintData: () => store.getState().reducerStatistic.statisticRating,
        getExportName: "Рейтинг отказов",
        model: StatisticRatingRoute
    }],
    ["statisticList", {
        getColumns: StatisticListColumns,
        getTableHeader: headerStatisticList,
        getPrintName: "Статистика/Перечень незакрытых заявок",
        getPrintData: () => store.getState().reducerStatistic.statisticList,
        getExportName: "Перечень не закрытых заявок",
        model: StatisticListRoute,
    }],
    ["logs", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Просмотр записи",
            "Просмотр записи",
            LogTab,
            "logItem",
            LogRoute
        ),
        getColumns: LogColumns,
        getTableHeader: headerLog,
        getPrintName: "Журнал действий пользователей",
        getPrintData: () => store.getState().reducerLog.logs,
        getExportName: "Журнал действий пользователей",
        model: LogRoute
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
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (открытие вкладки редактирования записи)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (открытие вкладки редактирования записи)`);
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
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (создание колонок)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (создание колонок)`);
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
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (создание заголовков экспорта)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (создание заголовков экспорта)`);
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
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (печать таблицы)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (печать таблицы)`);
    }
};

/**
 * Функция возврата модели раздела
 * @param key - ключ раздела
 * @returns any - модель раздела
 */
const getModel = (key) => {
    if (map.has(key)) {
        return map.get(key).model;
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (модель раздела)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (модель раздела)`);
    }
};

/**
 * Функция наименования файла для экспорта таблицы
 * @param key - ключ таблицы
 * @returns string - строка с наименоваием файла для экспорта таблицы
 */
const getExportName = (key) => {
    if (map.has(key)) {
        return map.get(key).getExportName;
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (печать таблицы)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (печать таблицы)`);
    }
};

export {openRecordTab, getColumns, getTableHeader, getPrintTable, getModel, getExportName}