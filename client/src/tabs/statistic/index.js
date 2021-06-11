// Раздел "Статистика"
import React from "react";
import {Tabs} from "antd";

import {TableComponent} from "../table";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";

import "./statistic.css";

const {TabPane} = Tabs;

export const StatisticComponent = () => {
    // Функция изменения активного ключа
    const onChangeTab = (activeKey) => {
        store.dispatch(ActionCreator.ActionCreatorTab.setActiveStatisticKey(activeKey));
    }

    return (
        <>
            <Tabs defaultActiveKey="statisticRating" className="statistic" onChange={onChangeTab}>
                <TabPane tab="Рейтинг отказов" key="statisticRating">
                    <TableComponent specKey="statisticRating"/>
                </TabPane>
                <TabPane tab="Перечень непринятых заявок" key="statisticList">
                    <TableComponent specKey="statisticList"/>
                </TabPane>
            </Tabs>
        </>
    )
}