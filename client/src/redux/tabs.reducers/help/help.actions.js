import {
    CREATE_HELP,
    EDIT_HELP,
    DELETE_HELP,
    GET_ALL_HELP,
    SET_ROW_DATA_HELP,
} from "./help.constants";

const ActionCreatorHelp = {
    // Добавление записи помощи
    createHelp: (profession) => {
        return {
            type: CREATE_HELP,
            payload: profession
        }
    },
    // Изменение записи помощи
    editHelp: (index, editTab) => {
        return {
            type: EDIT_HELP,
            payload: editTab,
            index: index
        }
    },
    // Удаление записи помощи
    deleteHelp: (index) => {
        return {
            type: DELETE_HELP,
            payload: index
        }
    },
    // Добавление всех записей помощи
    getAllHelp: (professions) => {
        return {
            type: GET_ALL_HELP,
            payload: professions
        }
    },
    // Установка данных для строки раздела "Помощь"
    setRowDataHelp: (item) => {
        return {
            type: SET_ROW_DATA_HELP,
            payload: item
        }
    }
}

export default ActionCreatorHelp;