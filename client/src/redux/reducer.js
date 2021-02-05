import initialState from "./initialState";
import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,

    CREATE_PROFESSION,
    EDIT_PROFESSION,
    DELETE_PROFESSION,
    GET_ALL_PROFESSIONS,
    SET_ROW_DATA_PROFESSION,

    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    GET_ALL_DEPARTMENTS,
    SET_ROW_DATA_DEPARTMENT,

    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    GET_ALL_PEOPLE,
    SET_ROW_DATA_PERSON,

    CREATE_TASK,
    EDIT_TASK,
    DELETE_TASK,
    GET_ALL_TASKS,
    SET_ROW_DATA_TASK,

    CREATE_EQUIPMENT_PROPERTY,
    EDIT_EQUIPMENT_PROPERTY,
    DELETE_EQUIPMENT_PROPERTY,
    GET_ALL_EQUIPMENT_PROPERTIES,
    SET_ROW_DATA_EQUIPMENT_PROPERTY,

    SET_ACTIVE_KEY,
    SET_PREV_ACTIVE_TAB,

    SET_LOADING_SKELETON
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
                rowDataDepartment:  action.payload
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
        case GET_ALL_PEOPLE:
            return {
                ...state,
                people: action.payload
            };
        case SET_ROW_DATA_PERSON:
            return {
                ...state,
                rowDataPerson:  action.payload
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

        case CREATE_EQUIPMENT_PROPERTY:
            return {
                ...state,
                equipmentProperties: [ ...state.equipmentProperties, action.payload ]
            };
        case EDIT_EQUIPMENT_PROPERTY:
            return {
                ...state,
                equipmentProperties: [ ...state.equipmentProperties.slice(0, action.index), action.payload,
                    ...state.equipmentProperties.slice(action.index + 1) ]
            };
        case DELETE_EQUIPMENT_PROPERTY:
            return {
                ...state,
                equipmentProperties: [ ...state.equipmentProperties.slice(0, action.payload),
                    ...state.equipmentProperties.slice(action.payload + 1) ]
            };
        case GET_ALL_EQUIPMENT_PROPERTIES:
            return {
                ...state,
                equipmentProperties: action.payload
            };
        case SET_ROW_DATA_EQUIPMENT_PROPERTY:
            return {
                ...state,
                rowDataEquipmentProperty:  action.payload
            };

        case SET_ACTIVE_KEY:
            return {
                ...state,
                activeKey: action.payload
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
        default:
            return state;
    }
};