// Создания вкладки записи
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import emptyTab from "./emptyTab";

/**
 * Создание вкладки записи
 * @param _id - id полученной строки
 * @param createTitle - заголовок вкладки создания записи
 * @param editTitle - заголовок вкладки редактирования записи
 * @param tab - вкладка, которая будет отрисована
 * @param tabKey - ключ вкладки
 * @param modelRoute - методы модели раздела
 * @constructor
 */
export default async function openRecord(_id, createTitle, editTitle, tab, tabKey, modelRoute) {
    try {
        // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

        // Название вкладки
        const title = _id === "-1" ? createTitle : editTitle;

        // Создаем пустую вкладку записи
        emptyTab(title, tab, tabKey);

        // Получаем данные для записи
        await modelRoute.get(_id);

        // Останавливаем показ спиннера загрузки при открытии вкладки с записью
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    } catch (e) {
        // Останавливаем показ спиннера загрузки при появлении ошибки
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    }
}