import initialState from "./initialState";
import {ADD_TAB, EDIT_TAB, REMOVE_TAB, PUSH_PROFESSION, EDIT_PROFESSION, DELETE_PROFESSION} from "./actions";

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
                editTab: action.payload
            };
        case REMOVE_TAB:
            let index = action.payload;
            return {
                ...state,
                tabs: [ ...state.tabs.slice(0, index), ...state.tabs.slice(index + 1) ]
            };
        case PUSH_PROFESSION:
            return {
                ...state,
                profession: [ ...state.profession, action.payload ]
            };
        case EDIT_PROFESSION:
            let j = action.index;
            return {
                ...state,
                profession: [ ...state.profession.slice(0, j), action.payload, ...state.profession.slice(j + 1) ]
            };
        case DELETE_PROFESSION:
            let i = action.payload;
            return {
                ...state,
                profession: [ ...state.profession.slice(0, i), ...state.profession.slice(i + 1) ]
            };
        default:
            return state;
    }
};