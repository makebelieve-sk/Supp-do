import initialState from "./logDO.state";
import {
    CREATE_LOGDO,
    EDIT_LOGDO,
    DELETE_LOGDO,
    GET_ALL_LOGDO,
    SET_ROW_DATA_LOGDO,
    SET_DATE,
    ADD_FILE,
    DELETE_FILE,
    GET_ALL_FILES
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
        default:
            return state;
    }
};