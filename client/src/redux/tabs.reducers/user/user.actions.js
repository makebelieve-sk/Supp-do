// Инициализация экшенов для раздела "Пользователи"
import {
    CREATE_USER,
    EDIT_USER,
    DELETE_USER,
    GET_ALL_USERS,
    SET_ROW_DATA_USER,
    SET_ERROR_RECORD_USER,
    SET_ERROR_TABLE_USER,
} from "./user.constants";

const ActionCreatorUser = {
    // Добавление пользователя
    createUser: (user) => {
        return {
            type: CREATE_USER,
            payload: user
        }
    },
    // Изменение пользователя
    editUser: (index, editTab) => {
        return {
            type: EDIT_USER,
            payload: editTab,
            index: index
        }
    },
    // Удаление пользователя
    deleteUser: (index) => {
        return {
            type: DELETE_USER,
            payload: index
        }
    },
    // Добавление всех пользователей
    getAllUsers: (items) => {
        return {
            type: GET_ALL_USERS,
            payload: items
        }
    },
    // Установка данных для строки раздела "Пользователи"
    setRowDataUser: (item) => {
        return {
            type: SET_ROW_DATA_USER,
            payload: item
        }
    },
    // Установка ошибки для записи
    setErrorRecordUser: (error) => {
        return {
            type: SET_ERROR_RECORD_USER,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableUser: (error) => {
        return {
            type: SET_ERROR_TABLE_USER,
            payload: error
        }
    },
}

export default ActionCreatorUser;