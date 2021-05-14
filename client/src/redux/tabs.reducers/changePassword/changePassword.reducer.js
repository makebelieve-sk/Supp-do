// Инициализация редьюсера раздела "Смена пароля"
import initialState from "./changePassword.state";
import {
    CHANGE_PASSWORD,
} from "./changePassword.constants";

export default function reducerChangePassword(state = initialState, action) {
    switch (action.type) {
        case CHANGE_PASSWORD:
            return {
                ...state,
                errorChangePassword: action.payload
            };
        default:
            return state;
    }
};