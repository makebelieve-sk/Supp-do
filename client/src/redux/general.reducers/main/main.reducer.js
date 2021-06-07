// Редьюсер для общего состояния
import initialState from "./main.state";
import {
    SET_PAGE_SIZE,
    SET_COLUMNS,
} from "./main.constants";

export default function reducerMain(state = initialState, action) {
    switch (action.type) {
        case SET_PAGE_SIZE:
            return {
                ...state,
                pageSizeOptions: action.payload
            };
        case SET_COLUMNS:
            return {
                ...state,
                columnsOptions: action.payload
            };
        default:
            return state;
    }
};