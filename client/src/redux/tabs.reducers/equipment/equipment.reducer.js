// Инициализация редьюсера раздела "Оборудование"
import initialState from "./equipment.state";
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
    SET_ERROR_RECORD,
    SET_ERROR_TABLE,
} from "./equipment.constants";

export default function reducerEquipment(state = initialState, action) {
    switch (action.type) {
        case CREATE_EQUIPMENT:
            return {
                ...state,
                equipment: [ ...state.equipment, action.payload ]
            };
        case EDIT_EQUIPMENT:
            return {
                ...state,
                equipment: [ ...state.equipment.slice(0, action.index), action.payload,
                    ...state.equipment.slice(action.index + 1) ]
            };
        case DELETE_EQUIPMENT:
            return {
                ...state,
                equipment: [ ...state.equipment.slice(0, action.payload),
                    ...state.equipment.slice(action.payload + 1) ]
            };
        case GET_ALL_EQUIPMENT:
            return {
                ...state,
                equipment: action.payload
            };
        case SET_ROW_DATA_EQUIPMENT:
            return {
                ...state,
                rowDataEquipment:  action.payload
            };
        case ADD_SELECT_ROW:
            return {
                ...state,
                selectsArray: [...state.selectsArray, action.payload]
            };
        case EDIT_SELECT_ROW:
            return {
                ...state,
                selectsArray: [ ...state.selectsArray.slice(0, action.index), action.payload,
                    ...state.selectsArray.slice(action.index + 1) ]
            };
        case DELETE_SELECT_ROW:
            return {
                ...state,
                selectsArray: [ ...state.selectsArray.slice(0, action.payload),
                    ...state.selectsArray.slice(action.payload + 1) ]
            };
        case GET_ALL_SELECT_ROWS:
            return {
                ...state,
                selectsArray: action.payload
            };
        case ADD_FILE:
            return {
                ...state,
                files: [...state.files, action.payload]
            };
        case DELETE_FILE:
            return {
                ...state,
                files: [ ...state.files.slice(0, action.payload),
                    ...state.files.slice(action.payload + 1) ]
            };
        case GET_ALL_FILES:
            return {
                ...state,
                files: action.payload
            };
        case SET_ERROR_RECORD:
            return {
                ...state,
                errorRecord: action.payload
            };
        case SET_ERROR_TABLE:
            return {
                ...state,
                errorTable: action.payload
            };
        default:
            return state;
    }
};