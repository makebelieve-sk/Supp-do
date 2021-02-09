// Инициализация ActionCreator`а для состояний загрузок
import {
    SET_LOADING_SKELETON
} from "./loading.constants";

const ActionCreatorLoading = {
    setLoadingSkeleton: (loading) => {
        return {
            type: SET_LOADING_SKELETON,
            payload: loading
        }
    }
}

export default ActionCreatorLoading;