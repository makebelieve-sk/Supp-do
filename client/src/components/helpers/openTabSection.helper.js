// Помощник для создания вкладки раздела
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {getEmptyTabWithLoading} from "./getEmptyTab.helper";
import {BodyManager} from "./bodyManager";

/**
 * Создание вкладки раздела
 * @param title - заголовок вкладки
 * @param key - ключ вкладки
 * @param url - адрес для получения массива данных для таблицы
 * @param dispatchAction - функция, устанавливает данные от сервера в хранилище redux
 * @param model - модель раздела
 * @constructor
 */
export const OpenTabSectionHelper = async (title, key, url, dispatchAction, model) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    // Вызываем пустую вкладку для показа спиннера загрузки
    getEmptyTabWithLoading(title, BodyManager, key);

    await model.getAll();

    // Останавливаем показ спиннера загрузки при открытии вкладки
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};