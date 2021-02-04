import initialState from "./initialState";
import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    GET_ALL_PROFESSIONS,
    GET_ALL_DEPARTMENTS,
    GET_ALL_PEOPLE,
    GET_ALL_TASKS,
    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    SET_PREV_ACTIVE_TAB,
    SET_LOADING_SKELETON,
    TEST_DATA,
} from "./actionsConstants";

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TAB:
            return {
                ...state,
                tabs: [ ...state.tabs, action.payload ]
            };
        case EDIT_TAB:
            return {
                ...state,
                tabs: [ ...state.tabs.slice(0, action.index), action.payload, ...state.tabs.slice(action.index + 1) ]
            };
        case REMOVE_TAB:
            let index = action.payload;
            return {
                ...state,
                tabs: [ ...state.tabs.slice(0, index), ...state.tabs.slice(index + 1) ]
            };
        case GET_ALL_PROFESSIONS:
            return {
                ...state,
                professions:  action.payload
            };
        case GET_ALL_DEPARTMENTS:
            return {
                ...state,
                departments: action.payload
            };
        case GET_ALL_PEOPLE:
            return {
                ...state,
                people: action.payload
            };
        case GET_ALL_TASKS:
            return {
                ...state,
                tasks: action.payload
            };
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
        case CREATE_PERSON:
            return {
                ...state,
                people: [ ...state.people, action.payload ]
            };
        case EDIT_PERSON:
            let pIndex = action.index;
            return {
                ...state,
                people: [ ...state.people.slice(0, pIndex), action.payload, ...state.people.slice(pIndex + 1) ]
            };
        case DELETE_PERSON:
            let pI = action.payload;
            return {
                ...state,
                people: [ ...state.people.slice(0, pI), ...state.people.slice(pI + 1) ]
            };
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
        case SET_PREV_ACTIVE_TAB:
            return {
                ...state,
                prevActiveTab: action.payload
            };
        case SET_LOADING_SKELETON:
            return {
                ...state,
                loadingSkeleton: action.payload
            };
        // Для теста==========================================
        case TEST_DATA:
            return {
                ...state,
                testData: action.payload
            };
        // ===================================================
        default:
            return state;
    }
};