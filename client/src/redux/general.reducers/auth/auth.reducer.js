// Инициализация редьюсера авторизации
import initialState from "./auth.state";
import {SET_ALERT, SET_USER,} from "./auth.constants";

export default function reducerAuth(state = initialState, action) {
    switch (action.type) {
        case SET_ALERT:
            return {
                ...state,
                regAlert: action.payload
            };
        case SET_USER:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};