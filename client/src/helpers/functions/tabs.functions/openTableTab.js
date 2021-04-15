// Создания вкладки раздела
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {BodyManager} from "../../../components/content.components/body/body.component";
import emptyTab from "./emptyTab";

/**
 * Создание вкладки раздела
 * @param title - заголовок вкладки
 * @param key - ключ вкладки
 * @param model - модель раздела
 * @constructor
 */
export default async function OpenTableTab(title, key, model) {
    try {
        // Устанавливаем показ спиннера загрузки при открытии вкладки раздела
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

        // Создаем пустую вкладку
        emptyTab(title, BodyManager, key);

        await model.getAll();

        // Останавливаем показ спиннера загрузки при открытии вкладки раздела
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    } catch (e) {
        // Останавливаем показ спиннера загрузки при появлении ошибки
        store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
    }
};