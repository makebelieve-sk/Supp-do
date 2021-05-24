// Методы модели "Статистика" вкладки Рейтинг
import moment from "moment";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays} from "../helpers/functions/general.functions/compare";
import {NoticeError} from "./helper";
import TabOptions from "../options/tab.options/record.options";
import {StatisticListRoute} from "./route.StatisticList";

export const StatisticRatingRoute = {
    // Адрес для работы с разделом "Статистика"
    base_url: "/api/analytic/statistic-rating/",
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

            await StatisticListRoute.getAll();  // Получаем все записи перечня не закрытых заявок

            if (items) {
                const reduxRating = store.getState().reducerStatistic.statisticRating;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items, reduxRating);

                if (shouldUpdate) {
                    // Записываем все профессии в хранилище
                    store.dispatch(ActionCreator.ActionCreatorStatistic.getAllRating(items));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorStatistic.setErrorRating("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    }
}