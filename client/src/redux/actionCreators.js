import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    GET_ALL_PROFESSIONS,
    GET_ALL_DEPARTMENTS,
    GET_ALL_PEOPLE,
    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    SET_PREV_ACTIVE_TAB
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
    editTab: (row) => {
        return {
            type: EDIT_TAB,
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
    // Установка предыдущего активного таба
    setPrevActiveTab: (key) => {
        return {
            type: SET_PREV_ACTIVE_TAB,
            payload: key
        }
    },
}

export default ActionCreator;