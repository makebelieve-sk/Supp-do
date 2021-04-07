// Методы модели "Статистика"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays} from "../helpers/functions/general.functions/compare";

export const StatisticRoute = {
    // Адрес для работы с разделом "Статистика"
    base_url: "/api/directory/professions/",
    // Получение всех данных для раздела "Статистика"
    getAll: async function () {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все данные
            const items = await request(this.base_url);

            if (items) {
                const reduxStatistic = store.getState().reducerStatistic.statistic;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxStatistic);

                if (shouldUpdate) {
                    // Записываем все профессии в хранилище
                    store.dispatch(ActionCreator.ActionCreatorStatistic.getAllStatistic(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            message.error("Возникла ошибка в разделе 'Статистика' при получении данных : ", e);
        }
    },
}