// Методы модели "Аналитика"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareObjects} from "../helpers/functions/general.functions/compare";

export const AnalyticRoute = {
    // Адрес для работы с разделом "Аналитика"
    base_url: "/api/analytic/current-state",
    // Получение всех данных для раздела "Аналитика"
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

            // Получаем все данные
            const items = await request(this.base_url);

            if (items) {
                const reduxAnalytic = store.getState().reducerAnalytic.analytic;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareObjects(items, reduxAnalytic);

                if (shouldUpdate) {
                    // Записываем предыдущие данные аналитики в хранилище
                    store.dispatch(ActionCreator.ActionCreatorAnalytic.getPrevAnalyticData(reduxAnalytic));

                    // Записываем данные аналитики в хранилище
                    store.dispatch(ActionCreator.ActionCreatorAnalytic.getAllAnalytic(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
            console.log(e)
            message.error("Возникла ошибка в разделе 'Аналитика' при получении данных: ", e);
        }
    },
    // Переход в раздел ЖДО
    goToLogDO: async function (param) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все данные
            const items = await request(this.base_url, "POST", param);

            if (items) {
                const reduxLogDO = store.getState().reducerLogDO.logDO;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareObjects(items, reduxLogDO);

                if (shouldUpdate) {
                    // Записываем данные аналитики в хранилище
                    store.dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            console.log(e)
            message.error("Возникла ошибка при переходе в раздел ЖДО: ", e);
        }
    },
}