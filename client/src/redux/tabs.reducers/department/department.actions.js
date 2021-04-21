// Инициализация экшенов для раздела "Подразделения"
import {
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    GET_ALL_DEPARTMENTS,
    SET_ROW_DATA_DEPARTMENT,
    SET_ERROR_RECORD,
    SET_ERROR_TABLE,
} from "./department.constants";

const ActionCreatorDepartment = {
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
    // Добавление всех подразделений
    getAllDepartments: (departments) => {
        return {
            type: GET_ALL_DEPARTMENTS,
            payload: departments
        }
    },
    // Установка данных для строки раздела "Подразделения"
    setRowDataDepartment: (rowData) => {
        return {
            type: SET_ROW_DATA_DEPARTMENT,
            payload: rowData
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

export default ActionCreatorDepartment;