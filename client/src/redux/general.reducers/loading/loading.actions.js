// Инициализация ActionCreator`а для состояний загрузок
import {
    SET_LOADING_SKELETON,
    SET_LOADING_TABLE
} from "./loading.constants";

const ActionCreatorLoading = {
    setLoadingSkeleton: (loading) => {
        return {
            type: SET_LOADING_SKELETON,
            payload: loading
        }
    },
    setLoadingTable: (loading) => {
        return {
            type: SET_LOADING_TABLE,
            payload: loading
        }
    }
}

export default ActionCreatorLoading;