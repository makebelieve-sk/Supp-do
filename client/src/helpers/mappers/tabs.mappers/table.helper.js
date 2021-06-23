// Помощник для работы с таблицей (записи, колонки, экспорт)
import {message} from "antd";

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

import {ProfessionTab} from "../../../tabs/profession";
import {DepartmentTab} from "../../../tabs/department";
import {PersonTab} from "../../../tabs/person";
import {TaskTab} from "../../../tabs/taskStatus";
import {EquipmentPropertyTab} from "../../../tabs/equipmentProperty";
import {EquipmentTab} from "../../../tabs/equipment";
import {LogDOTab} from "../../../tabs/logDo";
import {HelpTab} from "../../../tabs/help";
import {UserTab} from "../../../tabs/user";
import {RoleTab} from "../../../tabs/role";
import {LogTab} from "../../../tabs/log";

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
        title: "Профессии",
        model: ProfessionRoute,
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
        title: "Подразделения",
        model: DepartmentRoute,
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
        title: "Персонал",
        model: PersonRoute,
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
        title: "Состояния заявок",
        model: TaskStatusRoute,
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
        title: "Характеристики оборудования",
        model: EquipmentPropertyRoute,
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
        title: "Перечень оборудования",
        model: EquipmentRoute,
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
        title: "Журнал дефектов и отказов",
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
        title: "Помощь",
        model: UserRoute,
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
        title: "Пользователи",
        model: UserRoute,
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
        title: "Роли",
        model: RoleRoute,
    }],
    ["analytic", {
        model: AnalyticRoute,
        title: "Аналитика",
    }],
    ["statisticRating", {
        title: "Рейтинг отказов",
        model: StatisticRatingRoute,
    }],
    ["statisticList", {
        openRecordTab: (_id) => openRecord(
            _id,
            "Создание записи в журнале дефектов и отказов",
            "Редактирование записи в журнале дефектов и отказов",
            LogDOTab,
            "logDOItem",
            LogDORoute
        ),
        title: "Перечень незакрытых заявок",
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
        title: "Журнал действий пользователей",
        model: LogRoute,
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
 * Функция возврата заголовка Помощи
 * @param key - ключ таблицы
 * @returns string - строка заголовка Помощи
 */
const getTitle = (key) => {
    const statisticKey = store.getState().reducerTab.statisticKey;

    if (key === "statistic") {
        key = statisticKey;
    }

    const localMap = new Map([
        ["professionItem", "Профессии"],
        ["departmentItem", "Подразделения"],
        ["personItem", "Персонал"],
        ["equipmentItem", "Перечень оборудования"],
        ["equipmentPropertyItem", "Характеристики оборудования"],
        ["taskStatusItem", "Состояния заявок"],
        ["logDOItem", "Журнал дефектов и отказов"],
        ["helpItem", "Помощь"],
        ["userItem", "Пользователи"],
        ["roleItem", "Роли"],
        ["logItem", "Журнал действий пользователей"]
    ]);

    return localMap.has(key) ? localMap.get(key) : map.get(key).title;
};

export {openRecordTab, getModel, getTitle}