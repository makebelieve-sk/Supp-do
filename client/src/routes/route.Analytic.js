// Методы модели "Аналитика"
import {message} from "antd";

import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {request} from "../helpers/functions/general.functions/request.helper";
import {compareArrays, compareObjects} from "../helpers/functions/general.functions/compare";
import {NoticeError} from "./helper";

export const AnalyticRoute = {
    // Адрес для работы с разделом "Аналитика"
    base_url: "/api/analytic/current-state",
    // Адрес для работы с разделом "Аналитика"
    url_to_logDO: "/api/analytic/go-to-logDO",
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
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorAnalytic.setError("Возникла ошибка при получении записей: " + e.message));
            NoticeError.getAll(e.message); // Вызываем функцию обработки ошибки
        }
    },
    // Переход в раздел ЖДО
    goToLogDO: async function (url, filter) {
        try {
            // Устанавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(true));

            // Получаем все данные
            const items = !filter
                ? await request(this.url_to_logDO + url)
                : await request(this.url_to_logDO + url, "POST", filter);

            if (items) {
                const reduxLogDO = store.getState().reducerLogDO.logDO;

                // Если массивы не равны, то обновляем хранилище redux
                const shouldUpdate = compareArrays(items.itemsDto, reduxLogDO);

                // Устанавливаем дату
                const date = items.startDate && items.endDate ? items.startDate + "/" + items.endDate : null;

                // Устанавливаем начальную дату в датапикере
                store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(date));

                // Обновление легенды статусов
                store.dispatch(ActionCreator.ActionCreatorLogDO.setLegend(items.statusLegend));

                // Устанавливаем подсказку (какой фильтр сейчас есть у таблицы)
                store.dispatch(ActionCreator.ActionCreatorLogDO.setAlert(items.alert));

                if (shouldUpdate) {
                    // Записываем данные аналитики в хранилище
                    store.dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(items.itemsDto));
                }
            }

            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
        } catch (e) {
            // Останавливаем спиннер загрузки данных в таблицу
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingTable(false));
            // Устанавливаем ошибку в хранилище раздела
            store.dispatch(ActionCreator.ActionCreatorLogDO.setErrorTable("Возникла ошибка при переходе в раздел ЖДО: " + e.message));
            console.log(e.message);
            message.error("Возникла ошибка при переходе в раздел ЖДО: ", e.message);
            throw new Error(e.message);
        }
    }
}