// Инициализация редьюсера раздела "Пользователи"
import initialState from "./profile.state";
import {
    EDIT_PROFILE,
    SET_ERROR_RECORD_PROFILE,
} from "./profile.constants";

export default function reducerProfile(state = initialState, action) {
    switch (action.type) {
        case EDIT_PROFILE:
            return {
                ...state,
                profile: action.payload
            };
        case SET_ERROR_RECORD_PROFILE:
            return {
                ...state,
                errorRecordProfile: action.payload
            };
        default:
            return state;
    }
};