import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";

/**
 * Функция обновления истории вкладок
 * @param historyTabs - массив истории вкладок
 * @param key - ключ вкладки
 * @returns historyTab[] - обновленный массив истории вкладок
 */
export default function setTabsHistory(historyTabs, key) {
    const findHistoryTab = historyTabs.find(tab => tab === key);
    const indexOfHistoryTab = historyTabs.indexOf(findHistoryTab);

    if (findHistoryTab && indexOfHistoryTab >= 0) {
        historyTabs.splice(indexOfHistoryTab, 1);
        historyTabs.push(key);
    } else {
        historyTabs.push(key);
    }

    store.dispatch(ActionCreator.ActionCreatorTab.setHistoryTab(historyTabs));

    return historyTabs;
};