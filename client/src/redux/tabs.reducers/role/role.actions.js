import {
    CREATE_ROLE,
    EDIT_ROLE,
    DELETE_ROLE,
    GET_ALL_ROLES,
    SET_ROW_DATA_ROLE
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
    }
}

export default ActionCreatorRole;