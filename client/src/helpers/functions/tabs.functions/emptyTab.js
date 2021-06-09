// Создание новой вкладки
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import setTabsHistory from "../general.functions/setTabsHistory";

/**
 * Создание новой вкладки
 * @param title - заголовок вкладки
 * @param content - контент вкладки (UI-компонент)
 * @param key - ключ вкладки
 */
export default function emptyTab(title, content, key) {
    // Получаем текущие вкладки, активную вкладку и историю вкладок
    const tabs = store.getState().reducerTab.tabs;
    const historyTabs = store.getState().reducerTab.historyTabs;

    // Создаем объект вкладки
    const tabObject = {title, content, key};

    // Добавляем или изменяем объект вкладки
    const findTab = tabs.find((tab) => tab.key === key);
    const indexOf = tabs.indexOf(findTab);

    // Обновляем или добавляем вкладку
    findTab && indexOf >= 0 ? store.dispatch(ActionCreator.ActionCreatorTab.editTab(indexOf, tabObject)) :
        store.dispatch(ActionCreator.ActionCreatorTab.addTab(tabObject));

    // Установка истории вкладок
    const updateHistoryTabs = setTabsHistory(historyTabs, key);

    // Устанавливаем ключ активной вкладки в хранилище (последний элемент в массиве истории вкладок)
    store.dispatch(ActionCreator.ActionCreatorTab.setActiveKey(updateHistoryTabs[updateHistoryTabs.length - 1]));
}