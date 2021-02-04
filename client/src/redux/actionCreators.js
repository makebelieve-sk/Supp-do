import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    GET_ALL_PROFESSIONS,
    GET_ALL_DEPARTMENTS,
    GET_ALL_PEOPLE,
    GET_ALL_TASKS,
    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    SET_PREV_ACTIVE_TAB,
    SET_LOADING_SKELETON,
    TEST_DATA,
} from "./actionsConstants";

const ActionCreator = {
    // Добавление вкладки
    addTab: (tabContent) => {
        return {
            type: ADD_TAB,
            payload: tabContent
        }
    },
    // Редактируемая вкладка
    editTab: (index, row) => {
        return {
            type: EDIT_TAB,
            index: index,
            payload: row
        }
    },
    // Удаление вкладки
    removeTab: (index) => {
        return {
            type: REMOVE_TAB,
            payload: index
        }
    },
    // Добавление профессии
    getAllProfessions: (professions) => {
        return {
            type: GET_ALL_PROFESSIONS,
            payload: professions
        }
    },
    // Добавление профессии
    getAllDepartments: (departments) => {
        return {
            type: GET_ALL_DEPARTMENTS,
            payload: departments
        }
    },
    // Добавление профессии
    getAllPeople: (people) => {
        return {
            type: GET_ALL_PEOPLE,
            payload: people
        }
    },
    // Добавление состояния заявок
    getAllTasks: (tasks) => {
        return {
            type: GET_ALL_TASKS,
            payload: tasks
        }
    },
    // Добавление профессии
    createProfession: (profession) => {
        return {
            type: CREATE_PROFESSION,
            payload: profession
        }
    },
    // Изменение профессии
    editProfession: (index, editTab) => {
        return {
            type: EDIT_PROFESSION,
            payload: editTab,
            index: index
        }
    },
    // Удаление профессии
    deleteProfession: (index) => {
        return {
            type: DELETE_PROFESSION,
            payload: index
        }
    },
    // Добавление подразделения
    createDepartment: (department) => {
        return {
            type: CREATE_DEPARTMENT,
            payload: department
        }
    },
    // Изменение подразделения
    editDepartment: (index, editTab) => {
        return {
            type: EDIT_DEPARTMENT,
            payload: editTab,
            index: index
        }
    },
    // Удаление подразделения
    deleteDepartment: (index) => {
        return {
            type: DELETE_DEPARTMENT,
            payload: index
        }
    },
    // Добавление сотрудника
    createPerson: (profession) => {
        return {
            type: CREATE_PERSON,
            payload: profession
        }
    },
    // Изменение сотрудника
    editPerson: (index, editTab) => {
        return {
            type: EDIT_PERSON,
            payload: editTab,
            index: index
        }
    },
    // Удаление сотрудника
    deletePerson: (index) => {
        return {
            type: DELETE_PERSON,
            payload: index
        }
    },
    // Добавление записи о состоянии заявки
    createTask: (task) => {
        return {
            type: CREATE_TASK,
            payload: task
        }
    },
    // Изменение записи о состоянии заявки
    editTask: (index, editTab) => {
        return {
            type: EDIT_TASK,
            payload: editTab,
            index: index
        }
    },
    // Удаление записи о состоянии заявки
    deleteTask: (index) => {
        return {
            type: DELETE_TASK,
            payload: index
        }
    },
    // Установка предыдущего активного таба
    setPrevActiveTab: (key) => {
        return {
            type: SET_PREV_ACTIVE_TAB,
            payload: key
        }
    },
    setLoadingSkeleton: (loading) => {
        return {
            type: SET_LOADING_SKELETON,
            payload: loading
        }
    },
    // Для теста==========================================
    testData: (array) => {
        return {
            type: TEST_DATA,
            payload: array
        }
    },
    // ===================================================
}

export default ActionCreator;