// Создания вкладки раздела
import moment from "moment";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {BodyManager} from "../../../components/content.components/body/body.component";
import emptyTab from "./emptyTab";
import TabOptions from "../../../options/tab.options/record.options/record.options";

/**
 * Создание вкладки раздела
 * @param title - заголовок вкладки
 * @param key - ключ вкладки
 * @param model - модель раздела
 * @constructor
 */
export default async function OpenTableTab(title, key, model) {
    try {
        // Обнуляем датапикер раздела Статистика
        if (key === "statistic")
            store.dispatch(ActionCreator.ActionCreatorStatistic.setDateRating(
                moment().startOf("month").format(TabOptions.dateFormat) + "/" +
                moment().endOf("month").format(TabOptions.dateFormat))
            );

        // Устанавливаем показ спиннера загрузки при открытии вкладки раздела
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

        // Создаем пустую вкладку
        emptyTab(title, BodyManager, key);

        await model.getAll();

        // Останавливаем показ спиннера загрузки при открытии вкладки раздела
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    } catch (e) {
        console.log(e.message);
        // Останавливаем показ спиннера загрузки при появлении ошибки
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
        throw new Error(e.message);
    }
};