import initialState from "./initialState";
import {ADD_TAB, PUSH_PROFESSION, REMOVE_TAB} from "./actions";

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ADD_TAB:
            return {
                ...state,
                tabs: [ ...state.tabs, action.payload ]
            }
        case REMOVE_TAB:
            let index = action.payload;
            return {
                ...state,
                tabs: [ ...state.tabs.slice(0, index), ...state.tabs.slice(index + 1) ]
            }
        case PUSH_PROFESSION:
            return {
                ...state,
                profession: [ ...state.profession, action.payload ]
            }
        default:
            return state;
    }
};