// Инициализация экшенов для раздела "Статистика"
import {
    GET_ALL_RATING,
    GET_ALL_LIST,
    SET_DATE_RATING,
    SET_DATE_LIST,
    SET_ERROR_LIST,
    SET_ERROR_RATING,
} from "./statistic.constants";

const ActionCreatorStatistic = {
    // Добавление всех записей рейтинга
    getAllRating: (statistic) => {
        return {
            type: GET_ALL_RATING,
            payload: statistic
        }
    },
    // Добавление всех записей перечня
    getAllList: (statistic) => {
        return {
            type: GET_ALL_LIST,
            payload: statistic
        }
    },
    // Установка даты Рейтинга
    setDateRating: (date) => {
        return {
            type: SET_DATE_RATING,
            payload: date
        }
    },
    // Установка даты Перечня
    setDateList: (date) => {
        return {
            type: SET_DATE_LIST,
            payload: date
        }
    },
    // Установка ошибки вкладки Рейтинг
    setErrorRating: (error) => {
        return {
            type: SET_ERROR_RATING,
            payload: error
        }
    },
    // Установка ошибки вкладки Перечень
    setErrorList: (error) => {
        return {
            type: SET_ERROR_LIST,
            payload: error
        }
    },
}

export default ActionCreatorStatistic;