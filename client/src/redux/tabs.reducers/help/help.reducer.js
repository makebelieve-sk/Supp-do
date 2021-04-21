// Инициализация редьюсера раздела "Помощь"
import initialState from "./help.state";
import {
    CREATE_HELP,
    EDIT_HELP,
    DELETE_HELP,
    GET_ALL_HELP,
    SET_ROW_DATA_HELP,
    SET_ERROR_RECORD,
    SET_ERROR_TABLE
} from "./help.constants";

export default function reducerHelp(state = initialState, action) {
    switch (action.type) {
        case CREATE_HELP:
            return {
                ...state,
                help: [ ...state.help, action.payload ]
            };
        case EDIT_HELP:
            let j = action.index;
            return {
                ...state,
                help: [ ...state.help.slice(0, j), action.payload, ...state.help.slice(j + 1) ]
            };
        case DELETE_HELP:
            let i = action.payload;
            return {
                ...state,
                help: [ ...state.help.slice(0, i), ...state.help.slice(i + 1) ]
            };
        case GET_ALL_HELP:
            return {
                ...state,
                help: action.payload
            };
        case SET_ROW_DATA_HELP:
            return {
                ...state,
                rowDataHelp: action.payload
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