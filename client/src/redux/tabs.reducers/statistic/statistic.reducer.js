// Инициализация редьюсера раздела "Статистика"
import initialState from "./statistic.state";
import {
    GET_ALL_RATING,
    GET_ALL_LIST,
    SET_DATE_RATING,
    SET_DATE_LIST,
    SET_ERROR_RATING,
    SET_ERROR_LIST,
} from "./statistic.constants";

export default function reducerStatistic(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_RATING:
            return {
                ...state,
                statisticRating: action.payload
            };
        case GET_ALL_LIST:
            return {
                ...state,
                statisticList: action.payload
            };
        case SET_DATE_RATING:
            return {
                ...state,
                dateRating:  action.payload
            };
        case SET_DATE_LIST:
            return {
                ...state,
                dateList:  action.payload
            };
        case SET_ERROR_RATING:
            return {
                ...state,
                errorRating: action.payload
            };
        case SET_ERROR_LIST:
            return {
                ...state,
                errorList: action.payload
            };
        default:
            return state;
    }
};