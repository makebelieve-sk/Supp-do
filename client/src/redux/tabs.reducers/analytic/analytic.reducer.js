import initialState from "./analytic.state";
import {
    GET_ALL_ANALYTIC,
} from "./analytic.constants";

export default function reducerAnalytic(state = initialState, action) {
    switch (action.type) {
        case GET_ALL_ANALYTIC:
            return {
                ...state,
                analytic: action.payload
            };
        default:
            return state;
    }
};