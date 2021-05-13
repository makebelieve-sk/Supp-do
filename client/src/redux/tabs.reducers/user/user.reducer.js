// Инициализация редьюсера раздела "Пользователи"
import initialState from "./user.state";
import {
    CREATE_USER,
    EDIT_USER,
    DELETE_USER,
    GET_ALL_USERS,
    SET_ROW_DATA_USER,
    SET_ERROR_RECORD_USER,
    SET_ERROR_TABLE_USER,
} from "./user.constants";

export default function reducerUser(state = initialState, action) {
    switch (action.type) {
        case CREATE_USER:
            return {
                ...state,
                users: [ ...state.users, action.payload ]
            };
        case EDIT_USER:
            let j = action.index;
            return {
                ...state,
                users: [ ...state.users.slice(0, j), action.payload, ...state.users.slice(j + 1) ]
            };
        case DELETE_USER:
            let i = action.payload;
            return {
                ...state,
                users: [ ...state.users.slice(0, i), ...state.users.slice(i + 1) ]
            };
        case GET_ALL_USERS:
            return {
                ...state,
                users: action.payload
            };
        case SET_ROW_DATA_USER:
            return {
                ...state,
                rowDataUser: action.payload
            };
        case SET_ERROR_RECORD_USER:
            return {
                ...state,
                errorRecordUser: action.payload
            };
        case SET_ERROR_TABLE_USER:
            return {
                ...state,
                errorTableUser: action.payload
            };
        default:
            return state;
    }
};