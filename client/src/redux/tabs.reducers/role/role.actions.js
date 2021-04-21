// Инициализация экшенов для раздела "Роли"
import {
    CREATE_ROLE,
    EDIT_ROLE,
    DELETE_ROLE,
    GET_ALL_ROLES,
    SET_ROW_DATA_ROLE,
    SET_ERROR_RECORD,
    SET_ERROR_TABLE,
} from "./role.constants";

const ActionCreatorRole = {
    // Добавление роли
    createRole: (profession) => {
        return {
            type: CREATE_ROLE,
            payload: profession
        }
    },
    // Изменение роли
    editRole: (index, editTab) => {
        return {
            type: EDIT_ROLE,
            payload: editTab,
            index: index
        }
    },
    // Удаление роли
    deleteRole: (index) => {
        return {
            type: DELETE_ROLE,
            payload: index
        }
    },
    // Добавление всех ролей
    getAllRoles: (items) => {
        return {
            type: GET_ALL_ROLES,
            payload: items
        }
    },
    // Установка данных для строки раздела "Роли"
    setRowDataRole: (item) => {
        return {
            type: SET_ROW_DATA_ROLE,
            payload: item
        }
    },
    // Установка ошибки для записи
    setErrorRecord: (error) => {
        return {
            type: SET_ERROR_RECORD,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTable: (error) => {
        return {
            type: SET_ERROR_TABLE,
            payload: error
        }
    },
}

export default ActionCreatorRole;