import {
    GET_ALL_STATISTIC
} from "./statistic.constants";

const ActionCreatorStatistic = {
    // Добавление всех подразделений
    getAllStatistic: (statistic) => {
        return {
            type: GET_ALL_STATISTIC,
            payload: statistic
        }
    },
}

export default ActionCreatorStatistic;