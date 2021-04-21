// Инициализация экшенов для раздела "Характеристики оборудования"
import {
    CREATE_EQUIPMENT_PROPERTY,
    EDIT_EQUIPMENT_PROPERTY,
    DELETE_EQUIPMENT_PROPERTY,
    GET_ALL_EQUIPMENT_PROPERTIES,
    SET_ROW_DATA_EQUIPMENT_PROPERTY,
    SET_ERROR_RECORD,
    SET_ERROR_TABLE
} from "./equipmentProperty.constants";

const ActionCreatorEquipmentProperty = {
    // Добавление характеристики оборудования
    createEquipmentProperty: (equipmentProperty) => {
        return {
            type: CREATE_EQUIPMENT_PROPERTY,
            payload: equipmentProperty
        }
    },
    // Изменение характеристики оборудования
    editEquipmentProperty: (index, editTab) => {
        return {
            type: EDIT_EQUIPMENT_PROPERTY,
            payload: editTab,
            index: index
        }
    },
    // Удаление характеристики оборудования
    deleteEquipmentProperty: (index) => {
        return {
            type: DELETE_EQUIPMENT_PROPERTY,
            payload: index
        }
    },
    // Получение всех характеристик оборудования
    getAllEquipmentProperties: (equipmentProperties) => {
        return {
            type: GET_ALL_EQUIPMENT_PROPERTIES,
            payload: equipmentProperties
        }
    },
    // Установка данных для строки раздела "Характеристики оборудования"
    setRowDataEquipmentProperty: (rowData) => {
        return {
            type: SET_ROW_DATA_EQUIPMENT_PROPERTY,
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

export default ActionCreatorEquipmentProperty;