// Инициализация экшенов для раздела "Состояние заявок"
import {
    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    GET_ALL_TASKS,
    SET_ROW_DATA_TASK,
    SET_ERROR_RECORD,
    SET_ERROR_TABLE,
} from "./task.constants";

const ActionCreatorTask = {
    // Добавление записи о состоянии заявки
    createTask: (task) => {
        return {
            type: CREATE_TASK,
            payload: task
        }
    },
    // Изменение записи о состоянии заявки
    editTask: (index, editTab) => {
        return {
            type: EDIT_TASK,
            payload: editTab,
            index: index
        }
    },
    // Удаление записи о состоянии заявки
    deleteTask: (index) => {
        return {
            type: DELETE_TASK,
            payload: index
        }
    },
    // Добавление всех состояний заявок
    getAllTasks: (tasks) => {
        return {
            type: GET_ALL_TASKS,
            payload: tasks
        }
    },
    // Установка данных для строки раздела "Состояние заявок"
    setRowDataTask: (rowData) => {
        return {
            type: SET_ROW_DATA_TASK,
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

export default ActionCreatorTask;