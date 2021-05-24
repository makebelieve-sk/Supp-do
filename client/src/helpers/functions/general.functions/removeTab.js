// Функция удаления вкладки
import {message} from "antd";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";

export default function onRemove(targetKey, action = "remove") {
    const tabs = store.getState().reducerTab.tabs;
    const historyTabs = store.getState().reducerTab.historyTabs;

    if (action === "remove") {
        const findTab = tabs.find(tab => tab.key === targetKey);
        const indexOfTab = tabs.indexOf(findTab);

        const findHistoryTab = historyTabs.find(tab => tab === targetKey);
        const indexOfHistoryTab = historyTabs.indexOf(findHistoryTab);

        if (findHistoryTab && indexOfHistoryTab >= 0) {
            historyTabs.splice(indexOfHistoryTab, 1);

            store.dispatch(ActionCreator.ActionCreatorTab.setHistoryTab(historyTabs));
            store.dispatch(ActionCreator.ActionCreatorTab.setActiveKey(historyTabs[historyTabs.length - 1]));
        } else {
            store.dispatch(ActionCreator.ActionCreatorTab.setActiveKey(tabs[0].key));
        }

        // Удаляем вкладку, иначе выводим ошибку пользователю
        findTab && indexOfTab >= 0 ? store.dispatch(ActionCreator.ActionCreatorTab.removeTab(indexOfTab)) :
            message.error("Ошибка удаления вкладки " + targetKey).then(null);
    }
};