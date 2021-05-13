// Раздел "Статистика"
import React from "react";
import {Tabs} from "antd";

import {TableComponent} from "../../../tabs/table/table";

import "./statistic.css";

const {TabPane} = Tabs;

export const StatisticComponent = () => {
    return (
        <>
            <Tabs defaultActiveKey="statisticRating" className="statistic">
                <TabPane tab="Рейтинг отказов" key="statisticRating">
                    <TableComponent specKey="statisticRating"/>
                </TabPane>
                <TabPane tab="Перечень незакрытых заявок" key="statisticList">
                    <TableComponent specKey="statisticList"/>
                </TabPane>
            </Tabs>
        </>
    )
}