// Инициализация редьюсера раздела "Журнал дефектов и отказов"
import initialState from "./logDO.state";
import {
    CREATE_LOGDO,
    EDIT_LOGDO,
    DELETE_LOGDO,
    GET_ALL_LOGDO,
    SET_ROW_DATA_LOGDO,
    SET_DATE,
    SET_DATE_FROM_ANALYTIC,
    ADD_FILE,
    DELETE_FILE,
    GET_ALL_FILES,
    SET_LEGEND,
    SET_ALERT,
    SET_ERROR_RECORD_LOGDO,
    SET_ERROR_TABLE_LOGDO,
} from "./logDO.constants";

export default function reducerLogDO(state = initialState, action) {
    switch (action.type) {
        case CREATE_LOGDO:
            return {
                ...state,
                logDO: [ ...state.logDO, action.payload ]
            };
        case EDIT_LOGDO:
            return {
                ...state,
                logDO: [ ...state.logDO.slice(0, action.index), action.payload,
                    ...state.logDO.slice(action.index + 1) ]
            };
        case DELETE_LOGDO:
            return {
                ...state,
                logDO: [ ...state.logDO.slice(0, action.payload),
                    ...state.logDO.slice(action.payload + 1) ]
            };
        case GET_ALL_LOGDO:
            return {
                ...state,
                logDO: action.payload
            };
        case SET_ROW_DATA_LOGDO:
            return {
                ...state,
                rowDataLogDO:  action.payload
            };
        case SET_DATE:
            return {
                ...state,
                date:  action.payload
            };
        case SET_DATE_FROM_ANALYTIC:
            return {
                ...state,
                dateFromAnalytic:  action.payload
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
        case SET_LEGEND:
            return {
                ...state,
                legend: action.payload
            };
        case SET_ALERT:
            return {
                ...state,
                alert: action.payload
            };
        case SET_ERROR_RECORD_LOGDO:
            return {
                ...state,
                errorRecordLogDO: action.payload
            };
        case SET_ERROR_TABLE_LOGDO:
            return {
                ...state,
                errorTableLogDO: action.payload
            };
        default:
            return state;
    }
};