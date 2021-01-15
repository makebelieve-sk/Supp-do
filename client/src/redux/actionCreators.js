import {ADD_TAB, REMOVE_TAB, PUSH_PROFESSION} from "./actions";

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
    },
    pushProfession: (profession) => {
        return {
            type: PUSH_PROFESSION,
            payload: profession
        }
    }
}

export default ActionCreator;