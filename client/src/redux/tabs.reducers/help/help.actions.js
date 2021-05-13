// Инициализация экшенов для раздела "Помощь"
import {
    CREATE_HELP,
    EDIT_HELP,
    DELETE_HELP,
    GET_ALL_HELP,
    SET_ROW_DATA_HELP,
    SET_ERROR_RECORD_HELP,
    SET_ERROR_TABLE_HELP,
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
    },
    // Установка ошибки для записи
    setErrorRecordHelp: (error) => {
        return {
            type: SET_ERROR_RECORD_HELP,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableHelp: (error) => {
        return {
            type: SET_ERROR_TABLE_HELP,
            payload: error
        }
    },
}

export default ActionCreatorHelp;