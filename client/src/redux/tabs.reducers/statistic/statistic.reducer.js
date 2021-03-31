import initialState from "./statistic.state";
import {
    GET_ALL_STATISTIC,
} from "./statistic.constants";

export default function reducerStatistic(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_STATISTIC:
            return {
                ...state,
                statistic: action.payload
            };
        default:
            return state;
    }
};