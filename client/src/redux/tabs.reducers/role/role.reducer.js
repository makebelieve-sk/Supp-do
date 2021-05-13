// Инициализация редьюсера раздела "Роли"
import initialState from "./role.state";
import {
    CREATE_ROLE,
    EDIT_ROLE,
    DELETE_ROLE,
    GET_ALL_ROLES,
    SET_ROW_DATA_ROLE,
    SET_ERROR_RECORD_ROLE,
    SET_ERROR_TABLE_ROLE,
} from "./role.constants";

export default function reducerRole(state = initialState, action) {
    switch (action.type) {
        case CREATE_ROLE:
            return {
                ...state,
                roles: [ ...state.roles, action.payload ]
            };
        case EDIT_ROLE:
            let j = action.index;
            return {
                ...state,
                roles: [ ...state.roles.slice(0, j), action.payload, ...state.roles.slice(j + 1) ]
            };
        case DELETE_ROLE:
            let i = action.payload;
            return {
                ...state,
                roles: [ ...state.roles.slice(0, i), ...state.roles.slice(i + 1) ]
            };
        case GET_ALL_ROLES:
            return {
                ...state,
                roles: action.payload
            };
        case SET_ROW_DATA_ROLE:
            return {
                ...state,
                rowDataRole: action.payload
            };
        case SET_ERROR_RECORD_ROLE:
            return {
                ...state,
                errorRecordRole: action.payload
            };
        case SET_ERROR_TABLE_ROLE:
            return {
                ...state,
                errorTableRole: action.payload
            };
        default:
            return state;
    }
};