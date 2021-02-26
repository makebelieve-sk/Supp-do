import {
    CREATE_LOGDO,
    EDIT_LOGDO,
    DELETE_LOGDO,
    GET_ALL_LOGDO,
    SET_ROW_DATA_LOGDO,
    ADD_FILE,
    DELETE_FILE,
    GET_ALL_FILES,
    SET_NEW_DATE
} from "./logDO.constants";

const ActionCreatorLogDO = {
    // Добавление записи в журнал
    createLogDO: (logDO) => {
        return {
            type: CREATE_LOGDO,
            payload: logDO
        }
    },
    // Изменение записи в журнале
    editLogDO: (index, editTab) => {
        return {
            type: EDIT_LOGDO,
            payload: editTab,
            index: index
        }
    },
    // Удаление записи из журнала
    deleteLogDO: (index) => {
        return {
            type: DELETE_LOGDO,
            payload: index
        }
    },
    // Получение всех записей журнала
    getAllLogDO: (logsDO) => {
        return {
            type: GET_ALL_LOGDO,
            payload: logsDO
        }
    },
    // Установка данных для строки раздела "Журнал дефектов и отказов"
    setRowDataLogDO: (rowData) => {
        return {
            type: SET_ROW_DATA_LOGDO,
            payload: rowData
        }
    },
    // Добавление файла во вкладку "Файлы"
    addFile: (file) => {
        return {
            type: ADD_FILE,
            payload: file
        }
    },
    // Удаление файла во вкладке "Файлы"
    deleteFile: (index) => {
        return {
            type: DELETE_FILE,
            payload: index
        }
    },
    // Получение всех файлов во вкладке "Файлы"
    getAllFiles: (files) => {
        return {
            type: GET_ALL_FILES,
            payload: files
        }
    },
    // Установка даты с
    setDate: (date) => {
        return {
            type: SET_NEW_DATE,
            payload: date
        }
    }

}

export default ActionCreatorLogDO;