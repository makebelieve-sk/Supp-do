// Компонент, отрисовывающий вкладки и их содержимое
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Layout, Tabs} from "antd";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {AnalyticRoute} from "../../../routes/route.Analytic";
import onRemove from "../../../helpers/functions/general.functions/removeTab";

import "./content.css";
import setTabsHistory from "../../../helpers/functions/general.functions/setTabsHistory";

export const ContentComponent = () => {
    // Получаем активную вкладку, текущие вкладки и историю вкладок
    const {activeKey, tabs, historyTabs} = useSelector(state => state.reducerTab);

    // Изменяем активную вкладку
    const onChange = async activeKey => {
        // Обновляем вкладку "Аналитика"
        if (activeKey === "analytic") await AnalyticRoute.getAll();

        // Установка истории вкладок
        setTabsHistory(historyTabs, activeKey);

        // Установка активного ключа вкладки
        store.dispatch(ActionCreator.ActionCreatorTab.setActiveKey(activeKey));
    }

    // Отключаем возможность удаления первой вкладки
    useEffect(() => {
        if (tabs && tabs.length === 1) {
            const button = document.querySelector(".ant-tabs-tab-remove");

            if (button) button.style.display = "none";
        }
    }, [tabs]);

    return (
        <Layout.Content className="content-component">
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onRemove}
                tabPosition="top"
            >
                {tabs.map(tab => (
                    <Tabs.TabPane tab={tab.title} key={tab.key}>
                        <tab.content sectionComponent={tab.section} specKey={tab.key} />
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </Layout.Content>
    );
};