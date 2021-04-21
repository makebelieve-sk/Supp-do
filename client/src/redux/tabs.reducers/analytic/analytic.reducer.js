// Инициализация редьюсера раздела "Аналитка"
import initialState from "./analytic.state";
import {
    GET_ALL_ANALYTIC,
    GET_PREV_ANALYTIC_DATA,
    SET_ERROR,
} from "./analytic.constants";

export default function reducerAnalytic(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_ANALYTIC:
            return {
                ...state,
                analytic: action.payload
            };
        case GET_PREV_ANALYTIC_DATA:
            return {
                ...state,
                prevAnalyticData: action.payload
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