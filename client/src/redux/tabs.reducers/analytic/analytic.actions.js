import {
    GET_ALL_ANALYTIC
} from "./analytic.constants";

const ActionCreatorAnalytic = {
    // Добавление всех подразделений
    getAllAnalytic: (analytic) => {
        return {
            type: GET_ALL_ANALYTIC,
            payload: analytic
        }
    },
}

export default ActionCreatorAnalytic;