// Инициализация экшенов для раздела "Роли"
import {
    CREATE_ROLE,
    EDIT_ROLE,
    DELETE_ROLE,
    GET_ALL_ROLES,
    SET_ROW_DATA_ROLE,
    SET_ERROR_RECORD_ROLE,
    SET_ERROR_TABLE_ROLE,
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
    setErrorRecordRole: (error) => {
        return {
            type: SET_ERROR_RECORD_ROLE,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableRole: (error) => {
        return {
            type: SET_ERROR_TABLE_ROLE,
            payload: error
        }
    },
}

export default ActionCreatorRole;