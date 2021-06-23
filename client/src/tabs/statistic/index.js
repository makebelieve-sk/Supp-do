// Раздел "Статистика"
import React from "react";
import {Tabs} from "antd";

import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {StatisticRatingSection} from "../../sections/statisticRatingSection";
import {StatisticListSection} from "../../sections/statisticListSection";

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
                    {StatisticRatingSection()}
                </TabPane>

                <TabPane tab="Перечень непринятых заявок" key="statisticList">
                    {StatisticListSection()}
                </TabPane>
            </Tabs>
        </>
    )
}