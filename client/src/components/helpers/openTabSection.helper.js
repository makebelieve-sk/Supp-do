// Помощник для создания вкладки раздела
import moment from "moment";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {getEmptyTabWithLoading} from "./getEmptyTab.helper";
import {BodyManager} from "./bodyManager";
import {request} from "./request.helper";
import TabOptions from "../../options/tab.options/tab.options";

/**
 * Создание вкладки раздела
 * @param title - заголовок вкладки
 * @param key - ключ вкладки
 * @param url - адрес для получения массива данных для таблицы
 * @param dispatchAction - функция, устанавливает данные от сервера в хранилище redux
 * @constructor
 */
export const OpenTabSectionHelper = async (title, key, url, dispatchAction) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Вызываем пустую вкладку для показа спиннера загрузки
    getEmptyTabWithLoading(title, BodyManager, key);

    let URL = "/api/directory/" + url;

    if (url === "log-do") {
        URL = "/api/log-do/" + moment().startOf("month").format(TabOptions.dateFormat)
            + "/" + moment().endOf("month").format(TabOptions.dateFormat);
    }
    // Получаем данные для раздела
    const items = await request(URL);

    // Если есть данные, то записываем полученные данные в хранилище
    if (items && items.length > 0) {
        store.dispatch(dispatchAction(items));
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};