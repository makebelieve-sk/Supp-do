import initialState from "./tab.state";
import {
    ADD_TAB,
    EDIT_TAB,
    REMOVE_TAB,
    SET_ACTIVE_KEY,
    SET_TABS_IN_HISTORY,
    SET_TABS,
    SET_PAGE_SIZE,
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
            return {
                ...state,
                tabs: [ ...state.tabs.slice(0, action.payload), ...state.tabs.slice(action.payload + 1) ]
            };
        case SET_ACTIVE_KEY:
            return {
                ...state,
                activeKey: action.payload
            };
        case SET_TABS_IN_HISTORY:
            return {
                ...state,
                historyTabs: action.payload
            };
        case SET_TABS:
            return {
                ...state,
                tabs: action.payload
            };
        case SET_PAGE_SIZE:
            return {
                ...state,
                pageSizeOptions: action.payload
            };
        default:
            return state;
    }
};