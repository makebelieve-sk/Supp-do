// Инициализация редьюсера раздела "Подразделения"
import initialState from "./department.state";
import {
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    GET_ALL_DEPARTMENTS,
    SET_ROW_DATA_DEPARTMENT,
    SET_ERROR_RECORD_DEPARTMENT,
    SET_ERROR_TABLE_DEPARTMENT,
} from "./department.constants";

export default function reducerDepartment(state = initialState, action) {
    switch (action.type) {
        case CREATE_DEPARTMENT:
            return {
                ...state,
                departments: [ ...state.departments, action.payload ]
            };
        case EDIT_DEPARTMENT:
            let dIndex = action.index;
            return {
                ...state,
                departments: [ ...state.departments.slice(0, dIndex), action.payload, ...state.departments.slice(dIndex + 1) ]
            };
        case DELETE_DEPARTMENT:
            let dI = action.payload;
            return {
                ...state,
                departments: [ ...state.departments.slice(0, dI), ...state.departments.slice(dI + 1) ]
            };
        case GET_ALL_DEPARTMENTS:
            return {
                ...state,
                departments: action.payload
            };
        case SET_ROW_DATA_DEPARTMENT:
            return {
                ...state,
                rowDataDepartment: action.payload
            };
        case SET_ERROR_RECORD_DEPARTMENT:
            return {
                ...state,
                errorRecordDepartment: action.payload
            };
        case SET_ERROR_TABLE_DEPARTMENT:
            return {
                ...state,
                errorTableDepartment: action.payload
            };
        default:
            return state;
    }
};