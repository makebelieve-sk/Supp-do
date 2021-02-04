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

// Получение вкладки таблицы "Тестовые данные"
const getContentTestData = (add, request, tabs) => {
    // Создаем пустую вкладку 'Тестовые данные', для отображения загрузки
    add('Тестовые данные', ContentTab, 'testData', tabs);

    const testData = require("../../test.json");

    // Получаем текущие вкладки
    const currentTabs = store.getState().tabs;

    if (testData && testData.length > 0) {
        store.dispatch(ActionCreator.testData(testData));

        add('Тестовые данные', ContentTab, 'testData', currentTabs);
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

export {
    getContentProfession,
    getContentDepartment,
    getContentPerson,
    getContentTestData,
    getContentTaskStatus
}