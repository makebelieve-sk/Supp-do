import {ProfessionTab} from "../tabs/professionTab";
import {DepartmentTab} from "../tabs/departmentTab";
import {PersonTab} from "../tabs/personTab";

// Получение вкладки "Профессии"
const getProfession = async (add, tabs, request, row) => {
    if (request === null && row === null) {
        // Добавляем вкладку 'Создание профессии'
        add('Создание профессии', ProfessionTab, 'newProfession', tabs, row);
    } else {
        // Отправляем запрос на получение выбранной профессии
        let data = await request('/api/directory/professions/' + row._id);

        if (data) {
            // Добавляем вкладку 'Редактирование профессии'
            add('Редактирование профессии', ProfessionTab, 'updateProfession', tabs, row);
        }
    }
};

// Получение вкладки "Подразделения"
const getDepartment = async (add, tabs, request, row) => {
    if (request === null && row === null) {
        // Добавляем вкладку 'Создание профессии'
        add('Создание подразделения', DepartmentTab, 'newDepartment', tabs, row);
    } else {
        // Отправляем запрос на получение выбранной профессии
        let data = await request('/api/directory/departments/' + row._id);

        if (data) {
            // Добавляем вкладку 'Редактирование профессии'
            add('Редактирование подразделения', DepartmentTab, 'updateDepartment', tabs, row);
        }
    }

};

// Получение вкладки "Запись о сотруднике"
const getPerson = async (add, tabs, request, row) => {
    if (request === null && row === null) {
        // Добавляем вкладку 'Создание профессии'
        add('Создание записи о сотруднике', PersonTab, 'newPerson', tabs, row);
    } else {
        // Отправляем запрос на получение выбранной профессии
        let data = await request('/api/directory/people/' + row._id);

        if (data) {
            // Добавляем вкладку 'Редактирование профессии'
            add('Редактирование записи о сотруднике', PersonTab, 'updatePerson', tabs, row);
        }
    }
};

export {
    getProfession, getDepartment, getPerson
}