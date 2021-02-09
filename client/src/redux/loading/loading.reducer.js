// Создание reducer`а для состояний загрузок
import initialState from "./loading.state";
import {
    SET_LOADING_SKELETON
} from "./loading.constants";

export default function reducerLoading(state = initialState, action) {
    switch (action.type) {
        case SET_LOADING_SKELETON:
            return {
                ...state,
                loadingSkeleton: action.payload
            };
        default:
            return state;
    }
};