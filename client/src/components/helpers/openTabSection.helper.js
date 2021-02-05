// Помощник для создания вкладки раздела
import store from "../../redux/store";
import ActionCreator from "../../redux/actionCreators";
import {ContentTab} from "./contentTab";
import {request} from "./request.helper";
import {getEmptyTabWithLoading} from "./getEmptyTab.helper";


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
    store.dispatch(ActionCreator.setLoadingSkeleton(true));

    // Вызываем пустую вкладку для показа спиннера загрузки
    getEmptyTabWithLoading(title, ContentTab, key);

    // Получаем данные для раздела
    const items = await request(`/api/directory/${url}`);

    // Если есть данные, то записываем полученные данные в хранилище
    if (items && items.length > 0) {
        store.dispatch(dispatchAction(items));
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки
    store.dispatch(ActionCreator.setLoadingSkeleton(false));
};