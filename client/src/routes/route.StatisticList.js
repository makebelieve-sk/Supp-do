// Методы модели "Статистика" вкладки "Перечень"
import moment from "moment";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays} from "../helpers/functions/general.functions/compare";
import {NoticeError} from "./helper";
import TabOptions from "../options/tab.options/record.options/record.options";

export const StatisticListRoute = {
    // Адрес для работы с разделом "Статистика"
    base_url: "/api/analytic/statistic-list/",
    // Получение всех данных для раздела "Статистика"
    getAll: async function (
        date = moment().startOf("month").format(TabOptions.dateFormat) +
        "/" + moment().endOf("month").format(TabOptions.dateFormat)
    ) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все данные
            const items = await request(this.base_url + date);

            if (items) {
                const reduxList = store.getState().reducerStatistic.statisticList;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxList);

                if (shouldUpdate) {
                    // Записываем все профессии в хранилище
                    store.dispatch(ActionCreator.ActionCreatorStatistic.getAllList(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorStatistic.setErrorList("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    }
}