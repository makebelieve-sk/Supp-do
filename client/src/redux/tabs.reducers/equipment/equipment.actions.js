// Инициализация экшенов для раздела "Оборудование"
import {
    CREATE_EQUIPMENT,
    EDIT_EQUIPMENT,
    DELETE_EQUIPMENT,
    GET_ALL_EQUIPMENT,
    SET_ROW_DATA_EQUIPMENT,
    ADD_SELECT_ROW,
    EDIT_SELECT_ROW,
    DELETE_SELECT_ROW,
    GET_ALL_SELECT_ROWS,
    ADD_FILE,
    DELETE_FILE,
    GET_ALL_FILES,
    SET_ERROR_RECORD_EQUIPMENT,
    SET_ERROR_TABLE_EQUIPMENT,
} from "./equipment.constants";

const ActionCreatorEquipment = {
    // Добавление перечня оборудования
    createEquipment: (equipment) => {
        return {
            type: CREATE_EQUIPMENT,
            payload: equipment
        }
    },
    // Изменение перечня оборудования
    editEquipment: (index, editTab) => {
        return {
            type: EDIT_EQUIPMENT,
            payload: editTab,
            index: index
        }
    },
    // Удаление перечня оборудования
    deleteEquipment: (index) => {
        return {
            type: DELETE_EQUIPMENT,
            payload: index
        }
    },
    // Получение всех перечней оборудования
    getAllEquipment: (equipment) => {
        return {
            type: GET_ALL_EQUIPMENT,
            payload: equipment
        }
    },
    // Установка данных для строки раздела "Перечень оборудования"
    setRowDataEquipment: (rowData) => {
        return {
            type: SET_ROW_DATA_EQUIPMENT,
            payload: rowData
        }
    },
    // Добавление строки во вкладку "Характеристики"
    addSelectRow: (selectRow) => {
        return {
            type: ADD_SELECT_ROW,
            payload: selectRow
        }
    },
    // Изменение строки во вкладке "Характеристики"
    editSelectRow: (selectRow, index) => {
        return {
            type: EDIT_SELECT_ROW,
            payload: selectRow,
            index: index
        }
    },
    // Удаление строки во вкладке "Характеристики"
    deleteSelectRow: (index) => {
        return {
            type: DELETE_SELECT_ROW,
            payload: index
        }
    },
    // Получение всех строк во вкладке "Характеристики"
    getAllSelectRows: (rows) => {
        return {
            type: GET_ALL_SELECT_ROWS,
            payload: rows
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
    // Установка ошибки для записи
    setErrorRecordEquipment: (error) => {
        return {
            type: SET_ERROR_RECORD_EQUIPMENT,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableEquipment: (error) => {
        return {
            type: SET_ERROR_TABLE_EQUIPMENT,
            payload: error
        }
    },
}

export default ActionCreatorEquipment;