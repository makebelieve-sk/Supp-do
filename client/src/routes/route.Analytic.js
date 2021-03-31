// Методы модели "Аналитика"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays} from "../helpers/functions/general.functions/compare";

export const AnalyticRoute = {
    // Адрес для работы с разделом "Аналитика"
    base_url: "/api/directory/professions/",
    // Получение всех данных для раздела "Аналитика"
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все данные
            const items = await request(this.base_url);

            if (items) {
                const reduxAnalytic = store.getState().reducerAnalytic.analytic;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxAnalytic);

                if (shouldUpdate) {
                    // Записываем все профессии в хранилище
                    store.dispatch(ActionCreator.ActionCreatorAnalytic.getAllAnalytic(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка в разделе 'Аналитика' при получении данных : ", e);
        }
    },
}