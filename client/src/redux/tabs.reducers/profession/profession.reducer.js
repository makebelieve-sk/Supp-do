// Инициализация редьюсера раздела "Профессии"
import initialState from "./profession.state";
import {
    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    GET_ALL_PROFESSIONS,
    SET_ROW_DATA_PROFESSION,
    SET_ERROR_RECORD,
    SET_ERROR_TABLE,
} from "./profession.constants";

export default function reducerProfession(state = initialState, action) {
    switch (action.type) {
        case CREATE_PROFESSION:
            return {
                ...state,
                professions: [ ...state.professions, action.payload ]
            };
        case EDIT_PROFESSION:
            let j = action.index;
            return {
                ...state,
                professions: [ ...state.professions.slice(0, j), action.payload, ...state.professions.slice(j + 1) ]
            };
        case DELETE_PROFESSION:
            let i = action.payload;
            return {
                ...state,
                professions: [ ...state.professions.slice(0, i), ...state.professions.slice(i + 1) ]
            };
        case GET_ALL_PROFESSIONS:
            return {
                ...state,
                professions: action.payload
            };
        case SET_ROW_DATA_PROFESSION:
            return {
                ...state,
                rowDataProfession: action.payload
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