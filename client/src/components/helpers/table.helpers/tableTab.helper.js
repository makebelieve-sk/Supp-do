import {ProfessionTab} from "../../tabs/profession/profession.edit";
import {DepartmentTab} from "../../tabs/department/department.edit";
import {PersonTab} from "../../tabs/person/person.edit";
import {TaskTab} from "../../tabs/taskStatus/taskStatus.edit";
import {EquipmentPropertyTab} from "../../tabs/equipmentProperty/equipmentProperty.edit";
import {EquipmentTab} from "../../tabs/equipment/equipment.edit";
import {LogDOTab} from "../../tabs/logDO/logDO.edit";

import {ProfessionRoute} from "../../../routes/route.profession";
import {Departments} from "../../../model/Department";
import {People} from "../../../model/Person";
import {TaskStatusRoute} from "../../../routes/route.taskStatus";
import {EquipmentProperty} from "../../../model/EquipmentProperty";
import {Equipment} from "../../../model/equipment";
import {LogDORoute} from "../../../routes/route.LogDO";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";

import {getEmptyTabWithLoading} from "../getEmptyTab.helper";

/**
 * Добавление и заполнение вкладки "Профессии"
 * @param _id - id полученной строки
 * @constructor
 */
const getProfession = async (_id) => {
    try {
        // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

        // Название вкладки
        const title = _id === "-1" ? "Создание профессии" : "Редактирование профессии";

        // Вызываем пустую вкладку записи для показа спиннера загрузки
        getEmptyTabWithLoading(title, ProfessionTab, "professionItem");

        // Получаем данные для записи
        await ProfessionRoute.get(_id);

        // Останавливаем показ спиннера загрузки при открытии вкладки с записью
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    } catch (e) {
        // Останавливаем показ спиннера загрузки при появлении ошибки
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    }
};

/**
 * Добавление и заполнение вкладки "Подразделения"
 * @param _id - id полученной строки
 * @constructor
 */
const getDepartment = async (_id) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Название вкладки
    const title = _id === "-1" ? "Создание подразделения" : "Редактирование подразделения";

    // Вызываем пустую вкладку записи для показа спиннера загрузки
    getEmptyTabWithLoading(title, DepartmentTab, "departmentItem");

    // Получаем данные для записи
    await Departments.get(_id);

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Запись о сотруднике"
 * @param _id - id полученной строки
 * @constructor
 */
const getPerson = async (_id) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Название вкладки
    const title = _id === "-1" ? "Создание записи о сотруднике" : "Редактирование записи о сотруднике";

    // Вызываем пустую вкладку записи для показа спиннера загрузки
    getEmptyTabWithLoading(title, PersonTab, "personItem");

    // Получаем данные для записи
    await People.get(_id);

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Состояние заявок"
 * @param _id - id полученной строки
 * @constructor
 */
const getTask = async (_id) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Название вкладки
    const title = _id === "-1" ? "Создание записи о состоянии заявки" : "Редактирование записи о состоянии заявки";

    // Вызываем пустую вкладку записи для показа спиннера загрузки
    getEmptyTabWithLoading(title, TaskTab, "taskStatusItem");

    // Получаем данные для записи
    await TaskStatusRoute.get(_id);

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Характеристики оборудования"
 * @param _id - id полученной строки
 * @constructor
 */
const getEquipmentProperty = async (_id) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Название вкладки
    const title = _id === "-1" ? "Создание записи о характеристике оборудования" : "Редактирование записи о характеристике оборудования";

    // Вызываем пустую вкладку записи для показа спиннера загрузки
    getEmptyTabWithLoading(title, EquipmentPropertyTab, "equipmentPropertyItem");

    // Получаем данные для записи
    await EquipmentProperty.get(_id);

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Перечень оборудования"
 * @param _id - id полученной строки
 * @constructor
 */
const getEquipment = async (_id) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Название вкладки
    const title = _id === "-1" ? "Создание записи об объекте оборудования" : "Редактирование записи об объекте оборудования";

    // Вызываем пустую вкладку записи для показа спиннера загрузки
    getEmptyTabWithLoading(title, EquipmentTab, "equipmentItem");

    // Получаем данные для записи
    await Equipment.get(_id);

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Журнал дефектов и отказов"
 * @param _id - id полученной строки
 * @constructor
 */
const getLogDO = async (_id) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Название вкладки
    const title = _id === "-1" ? "Создание записи в журнале дефектов и отказов" : "Редактирование записи в журнале дефектов и отказов";

    // Вызываем пустую вкладку записи для показа спиннера загрузки
    getEmptyTabWithLoading(title, LogDOTab, "logDOItem");

    // Получаем данные для записи
    await LogDORoute.get(_id);

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

export {getProfession, getDepartment, getPerson, getTask, getEquipmentProperty, getEquipment, getLogDO}