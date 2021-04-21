// Инициализация экшенов для раздела "Статистика"
import {
    GET_ALL_STATISTIC,
    SET_ERROR,
} from "./statistic.constants";

const ActionCreatorStatistic = {
    // Добавление всех подразделений
    getAllStatistic: (statistic) => {
        return {
            type: GET_ALL_STATISTIC,
            payload: statistic
        }
    },
    // Установка ошибки для записи
    setError: (error) => {
        return {
            type: SET_ERROR,
            payload: error
        }
    },
}

export default ActionCreatorStatistic;