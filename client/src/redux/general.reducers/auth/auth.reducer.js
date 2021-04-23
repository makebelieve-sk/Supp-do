// Создание reducer`а для состояний авторизации
import initialState from "./auth.state";
import {
    SET_ALERT,
    SET_USER,
    SET_MENU,
} from "./auth.constants";

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
        case SET_MENU:
            return {
                ...state,
                menuItems: action.payload
            };
        default:
            return state;
    }
};