// Инициализация редьюсера раздела "Состояние заявок"
import initialState from "./task.state";
import {
    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    GET_ALL_TASKS,
    SET_ROW_DATA_TASK,
    SET_ERROR_RECORD_TASK,
    SET_ERROR_TABLE_TASK,
} from "./task.constants";

export default function reducerTask(state = initialState, action) {
    switch (action.type) {
        case CREATE_TASK:
            return {
                ...state,
                tasks: [ ...state.tasks, action.payload ]
            };
        case EDIT_TASK:
            let jT = action.index;
            return {
                ...state,
                tasks: [ ...state.tasks.slice(0, jT), action.payload, ...state.tasks.slice(jT + 1) ]
            };
        case DELETE_TASK:
            let iT = action.payload;
            return {
                ...state,
                tasks: [ ...state.tasks.slice(0, iT), ...state.tasks.slice(iT + 1) ]
            };
        case GET_ALL_TASKS:
            return {
                ...state,
                tasks: action.payload
            };
        case SET_ROW_DATA_TASK:
            return {
                ...state,
                rowDataTask:  action.payload
            };
        case SET_ERROR_RECORD_TASK:
            return {
                ...state,
                errorRecordTask: action.payload
            };
        case SET_ERROR_TABLE_TASK:
            return {
                ...state,
                errorTableTask: action.payload
            };
        default:
            return state;
    }
};