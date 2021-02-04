import store from "../../redux/store";
import ActionCreator from "../../redux/actionCreators";
import {ContentTab} from "./contentTab";

// Получение вкладки таблицы "Профессии"
const getContentProfession = async (add, request, tabs) => {
    // Создаем пустую вкладку 'Профессии', для отображения загрузки
    add('Профессии', ContentTab, 'professions', tabs);

    const professions = await request('/api/directory/professions');

    // Получаем текущие вкладки
    const currentTabs = store.getState().tabs;

    if (professions && professions.length > 0) {
        store.dispatch(ActionCreator.getAllProfessions(professions));

        add('Профессии', ContentTab, 'professions', currentTabs);
    }
};

// Получение вкладки таблицы "Профессии"
const getContentDepartment = async (add, request, tabs) => {
    // Создаем пустую вкладку 'Подразделения', для отображения загрузки
    add('Подразделения', ContentTab, 'departments', tabs);

    const departments = await request('/api/directory/departments');

    // Получаем текущие вкладки
    const currentTabs = store.getState().tabs;

    if (departments && departments.length > 0) {
        store.dispatch(ActionCreator.getAllDepartments(departments));

        add('Подразделения', ContentTab, 'departments', currentTabs);
    }
};

// Получение вкладки таблицы "Профессии"
const getContentPerson = async (add, request, tabs) => {
    // Создаем пустую вкладку 'Персонал', для отображения загрузки
    add('Персонал', ContentTab, 'people', tabs);

    const people = await request('/api/directory/people');

    // Получаем текущие вкладки
    const currentTabs = store.getState().tabs;

    if (people && people.length > 0) {
        store.dispatch(ActionCreator.getAllPeople(people));

        add('Персонал', ContentTab, 'people', currentTabs);
    }
};

// Получение вкладки таблицы "Состояние заявки"
const getContentTaskStatus = async (add, request, tabs) => {
    // Создаем пустую вкладку 'Персонал', для отображения загрузки
    add('Состояние заявки', ContentTab, 'tasks', tabs);

    const tasks = await request('/api/directory/taskStatus');

    // Получаем текущие вкладки
    const currentTabs = store.getState().tabs;

    if (tasks && tasks.length > 0) {
        store.dispatch(ActionCreator.getAllTasks(tasks));

        add('Состояние заявки', ContentTab, 'tasks', currentTabs);
    }
};

// Размещение вкладки с таблицей "Характеристики оборудования"
const getContentEquipmentProperty = async (add, request, tabs) => {
    // Создаем пустую вкладку 'Характеристики оборудования', для отображения загрузки
    add('Характеристики оборудования', ContentTab, 'equipmentProperties', tabs);

    const items = await request('/api/directory/equipment-property');

    // Получаем текущие вкладки
    const currentTabs = store.getState().tabs;

    if (items && items.length > 0) {
        store.dispatch(ActionCreator.getAllEquipmentProperties(items));

        add('Характеристики оборудования', ContentTab, 'equipmentProperties', currentTabs);
    }
};

export {
    getContentProfession,
    getContentDepartment,
    getContentPerson,
    getContentTaskStatus,
    getContentEquipmentProperty
}