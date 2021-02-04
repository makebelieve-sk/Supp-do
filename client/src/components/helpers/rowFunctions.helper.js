import {ProfessionTab} from "../tabs/professionTab";
import {DepartmentTab} from "../tabs/departmentTab";
import {PersonTab} from "../tabs/personTab";
import {TaskTab} from "../tabs/taskTab";
import store from "../../redux/store";
import ActionCreator from "../../redux/actionCreators";

// Получение вкладки "Профессии"
const getProfession = async (add, tabs, request, row) => {
    // Устанавливаем загрузку скелетона при открытии записи
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (request === null && row === null) {
        // Добавляем вкладку 'Создание профессии'
        add('Создание профессии', ProfessionTab, 'newProfession', tabs, row);
    } else {
        // Создаем пустую вкладку 'Редактирование профессии', для отображения загрузки
        add('Редактирование профессии', ProfessionTab, 'updateProfession', tabs);

        // Получаем текущие вкладки
        const currentTabs = store.getState().tabs;

        // Отправляем запрос на получение выбранной профессии
        let data = await request('/api/directory/professions/' + row._id);
        if (data) {
            // Изменяем вкладку 'Редактирование профессии', добавленную ранее
            add('Редактирование профессии', ProfessionTab, 'updateProfession', currentTabs, data.profession);
        }
    }

    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

// Получение вкладки "Подразделения"
const getDepartment = async (add, tabs, request, row) => {
    // Устанавливаем загрузку скелетона при открытии записи
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (request === null && row === null) {
        // Добавляем вкладку 'Создание профессии'
        add('Создание подразделения', DepartmentTab, 'newDepartment', tabs, row);
    } else {
        // Создаем пустую вкладку 'Редактирование профессии', для отображения загрузки
        add('Редактирование подразделения', ProfessionTab, 'updateProfession', tabs);

        // Получаем текущие вкладки
        const currentTabs = store.getState().tabs;

        // Отправляем запрос на получение выбранной профессии
        let data = await request('/api/directory/departments/' + row._id);

        if (data) {
            // Изменяем вкладку 'Редактирование профессии', добавленную ранее
            add('Редактирование подразделения', DepartmentTab, 'updateDepartment', currentTabs, data.department);
        }
    }

    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

// Получение вкладки "Запись о сотруднике"
const getPerson = async (add, tabs, request, row) => {
    // Устанавливаем загрузку скелетона при открытии записи
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (request === null && row === null) {
        // Добавляем вкладку 'Создание профессии'
        add('Создание записи о сотруднике', PersonTab, 'newPerson', tabs, row);
    } else {
        // Создаем пустую вкладку 'Редактирование профессии', для отображения загрузки
        add('Редактирование записи о сотруднике', ProfessionTab, 'updateProfession', tabs);

        // Получаем текущие вкладки
        const currentTabs = store.getState().tabs;

        // Отправляем запрос на получение выбранной профессии
        let data = await request('/api/directory/people/' + row._id);

        if (data) {
            // Изменяем вкладку 'Редактирование профессии', добавленную ранее
            add('Редактирование записи о сотруднике', PersonTab, 'updatePerson', currentTabs, data.person);
        }
    }

    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

// Получение вкладки "Состояние заявок"
const getTask = async (add, tabs, request, row) => {
    // Устанавливаем загрузку скелетона при открытии записи
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    if (request === null && row === null) {
        // Добавляем вкладку 'Создание записи о состоянии заявки'
        add('Создание записи о состоянии заявки', TaskTab, 'newTask', tabs, row);
    } else {
        // Создаем пустую вкладку 'Редактирование записи о состоянии заявки', для отображения загрузки
        add('Редактирование записи о состоянии заявки', TaskTab, 'updateTask', tabs);

        // Получаем текущие вкладки
        const currentTabs = store.getState().tabs;

        // Отправляем запрос на получение выбранной записи о состоянии заявки
        let data = await request('/api/directory/taskStatus/' + row._id);
        if (data) {
            // Изменяем вкладку 'Редактирование записи о состоянии заявки', добавленную ранее
            add('Редактирование записи о состоянии заявки', TaskTab, 'updateTask', currentTabs, data.task);
        }
    }

    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};

export {
    getProfession, getDepartment, getPerson, getTask
}