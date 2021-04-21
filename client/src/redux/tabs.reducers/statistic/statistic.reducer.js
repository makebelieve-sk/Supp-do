// Инициализация редьюсера раздела "Статистика"
import initialState from "./statistic.state";
import {
    GET_ALL_STATISTIC,
    SET_ERROR,
} from "./statistic.constants";

export default function reducerStatistic(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_STATISTIC:
            return {
                ...state,
                statistic: action.payload
            };
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};