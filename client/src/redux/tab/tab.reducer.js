import initialState from "./tab.state";
import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    SET_ACTIVE_KEY,
    SET_PREV_ACTIVE_TAB,
} from "./tab.constants";

export default function reducerTab(state = initialState, action) {
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
        default:
            return state;
    }
};