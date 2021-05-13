// Инициализация экшенов для раздела "Профессии"
import {
    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    GET_ALL_PROFESSIONS,
    SET_ROW_DATA_PROFESSION,
    SET_ERROR_RECORD_PROFESSION,
    SET_ERROR_TABLE_PROFESSION,
} from "./profession.constants";

const ActionCreatorProfession = {
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
    // Добавление всех профессий
    getAllProfessions: (professions) => {
        return {
            type: GET_ALL_PROFESSIONS,
            payload: professions
        }
    },
    // Установка данных для строки раздела "Профессии"
    setRowDataProfession: (item) => {
        return {
            type: SET_ROW_DATA_PROFESSION,
            payload: item
        }
    },
    // Установка ошибки для записи
    setErrorRecordProfession: (error) => {
        return {
            type: SET_ERROR_RECORD_PROFESSION,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableProfession: (error) => {
        return {
            type: SET_ERROR_TABLE_PROFESSION,
            payload: error
        }
    },
}

export default ActionCreatorProfession;