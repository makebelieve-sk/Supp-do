// Инициализация редьюсера раздела "Журнал действий пользователя"
import initialState from "./log.state";
import {
    DELETE_LOG,
    SET_DATA,
    GET_ALL_LOGS,
    SET_ROW_DATA_LOG,
    SET_ERROR_RECORD_LOG,
    SET_ERROR_TABLE_LOG
} from "./log.constants";

export default function reducerLog(state = initialState, action) {
    switch (action.type) {
        case DELETE_LOG:
            let i = action.payload;
            return {
                ...state,
                logs: [ ...state.logs.slice(0, i), ...state.logs.slice(i + 1) ]
            };
        case SET_DATA:
            return {
                ...state,
                dateLog: action.payload
            };
        case GET_ALL_LOGS:
            return {
                ...state,
                logs: action.payload
            };
        case SET_ROW_DATA_LOG:
            return {
                ...state,
                rowDataLog: action.payload
            };
        case SET_ERROR_RECORD_LOG:
            return {
                ...state,
                errorRecordLog: action.payload
            };
        case SET_ERROR_TABLE_LOG:
            return {
                ...state,
                errorTableLog: action.payload
            };
        default:
            return state;
    }
};