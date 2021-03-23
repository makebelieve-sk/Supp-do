// Компонент ContentComponent, отвечающий за показ вкладок и их содержимого
import React from "react";
import {useSelector} from "react-redux";
import {message, Tabs} from "antd";

import {ActionCreator} from "../../../../redux/combineActions";
import {DeleteTabContext} from "../../../../context/deleteTab.context";
import store from "../../../../redux/store";

import "./content.css";

export const ContentComponent = () => {
    // Получаем текущие вкладки, активную вкладку и историю вкладок
    const {activeKey, tabs, historyTabs} = useSelector(state => state.reducerTab);

    // Функция удаления вкладки
    const onRemove = (targetKey, action) => {
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

    // Изменяем активную вкладку
    const onChange = activeKey => {
        // Установка истории вкладок
        const findHistoryTab = historyTabs.find(tab => tab === activeKey);
        const indexOfHistoryTab = historyTabs.indexOf(findHistoryTab);

        // Устанавливаем историю вкладок при изменении активной вкладки
        if (findHistoryTab && indexOfHistoryTab >= 0) {
            historyTabs.splice(indexOfHistoryTab, 1);
            historyTabs.push(activeKey);
        } else {
            historyTabs.push(activeKey);
        }

        store.dispatch(ActionCreator.ActionCreatorTab.setHistoryTab(historyTabs));

        // Установка активного ключа вкладки
        store.dispatch(ActionCreator.ActionCreatorTab.setActiveKey(activeKey));
    }

    return tabs && tabs.length > 0 ?
        <DeleteTabContext.Provider value={onRemove}>
            <Tabs hideAdd onChange={onChange} activeKey={activeKey} type="editable-card" onEdit={onRemove}>
                {tabs.map(tab => (
                    <Tabs.TabPane tab={tab.title} key={tab.key}>
                        {<tab.content specKey={tab.key}/>}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </DeleteTabContext.Provider> :
        <div style={{textAlign: "center", padding: 10}}>Нет открытых вкладок.</div>
}