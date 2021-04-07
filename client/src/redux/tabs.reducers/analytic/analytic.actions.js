import {
    GET_ALL_ANALYTIC,
    GET_PREV_ANALYTIC_DATA
} from "./analytic.constants";

const ActionCreatorAnalytic = {
    // Получение данных аналитики
    getAllAnalytic: (analytic) => {
        return {
            type: GET_ALL_ANALYTIC,
            payload: analytic
        }
    },
    // Запись прошлых данных аналитики
    getPrevAnalyticData: (prevAnalytic) => {
        return {
            type: GET_PREV_ANALYTIC_DATA,
            payload: prevAnalytic
        }
    },
}

export default ActionCreatorAnalytic;