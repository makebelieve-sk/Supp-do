import {ADD_TAB, REMOVE_TAB} from "./actions";

const ActionCreator = {
    addTab: (tabContent) => {
        return {
            type: ADD_TAB,
            payload: tabContent
        }
    },
    removeTab: (index) => {
        return {
            type: REMOVE_TAB,
            payload: index
        }
    }
}

export default ActionCreator;