import {
    CREATE_EQUIPMENT,
    EDIT_EQUIPMENT,
    DELETE_EQUIPMENT,
    GET_ALL_EQUIPMENT,
    SET_ROW_DATA_EQUIPMENT
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
    }
}

export default ActionCreatorEquipment;