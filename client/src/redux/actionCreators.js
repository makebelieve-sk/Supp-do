import {ADD_TAB, EDIT_TAB, REMOVE_TAB, PUSH_PROFESSION, EDIT_PROFESSION, DELETE_PROFESSION} from "./actions";

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
}

export default ActionCreator;