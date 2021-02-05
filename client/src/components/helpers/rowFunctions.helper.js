import {ProfessionTab} from "../tabs/professionTab";
import {DepartmentTab} from "../tabs/departmentTab";
import {PersonTab} from "../tabs/personTab";
import {TaskTab} from "../tabs/taskTab";
import {EquipmentPropertyTab} from "../tabs/EquipmentPropertyTab";
import store from "../../redux/store";
import ActionCreator from "../../redux/actionCreators";
import {request} from "./request.helper";
import {getEmptyTabWithLoading} from "./getEmptyTab.helper";

/**
 * Добавление и заполнение вкладки "Профессии"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getProfession = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание профессии', ProfessionTab, 'newProfession'
        );
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование профессии', ProfessionTab, 'updateProfession'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/professions/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.setRowDataProfession(data.profession));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Подразделения"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getDepartment = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание подразделения', DepartmentTab, 'newDepartment'
        );
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование подразделения', DepartmentTab, 'updateDepartment'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/departments/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.setRowDataDepartment(data.department));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Запись о сотруднике"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getPerson = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание записи о сотруднике', PersonTab, 'newPerson'
        );
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование записи о сотруднике', PersonTab, 'updatePerson'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/people/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.setRowDataPerson(data.person));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Состояние заявок"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getTask = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание записи о состоянии заявки', TaskTab, 'newTask'
        );
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование записи о состоянии заявки', TaskTab, 'updateTask'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/taskStatus/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.setRowDataTask(data.task));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Характеристики оборудования"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getEquipmentProperty = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание записи о характеристике оборудования', EquipmentPropertyTab, 'newEquipmentProperty'
        );
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование записи о характеристике оборудования', EquipmentPropertyTab, 'updateEquipmentProperty'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/equipment-property/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.setRowDataEquipmentProperty(data.equipmentProperty));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

export {
    getProfession, getDepartment, getPerson, getTask, getEquipmentProperty
}