import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    PUSH_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    PUSH_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    PUSH_PERSON,
    EDIT_PERSON,
    DELETE_PERSON
} from "./actions";

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
    pushProfession: (profession) => {
        return {
            type: PUSH_PROFESSION,
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
    pushDepartment: (department) => {
        return {
            type: PUSH_DEPARTMENT,
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
    pushPerson: (profession) => {
        return {
            type: PUSH_PERSON,
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
}

export default ActionCreator;