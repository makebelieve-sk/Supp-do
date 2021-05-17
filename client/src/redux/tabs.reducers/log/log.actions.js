// Инициализация экшенов для раздела "Журнал действий пользователя"
import {
    DELETE_LOG,
    SET_DATA,
    GET_ALL_LOGS,
    SET_ROW_DATA_LOG,
    SET_ERROR_RECORD_LOG,
    SET_ERROR_TABLE_LOG
} from "./log.constants";

const ActionCreatorLog = {
    // Удаление записи
    deleteLog: (_id) => {
        return {
            type: DELETE_LOG,
            payload: _id
        }
    },
    // Установка датапикера
    setDateLog: (date) => {
        return {
            type: SET_DATA,
            payload: date
        }
    },
    // Добавление всех записей
    getAllLog: (logs) => {
        return {
            type: GET_ALL_LOGS,
            payload: logs
        }
    },
    // Установка данных для строки раздела "Журнал действий пользователя"
    setRowDataLog: (item) => {
        return {
            type: SET_ROW_DATA_LOG,
            payload: item
        }
    },
    // Установка ошибки для записи
    setErrorRecordLog: (error) => {
        return {
            type: SET_ERROR_RECORD_LOG,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableLog: (error) => {
        return {
            type: SET_ERROR_TABLE_LOG,
            payload: error
        }
    },
}

export default ActionCreatorLog;