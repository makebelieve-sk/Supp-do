// Компонент столбчатой диаграммы
import React from "react";
import {Col, Row} from "antd";
import {Column} from '@ant-design/charts';

import "./columnChart.css";

export const ColumnChartComponent = ({title, data}) => {
    // Объект настроек графика
    const config = {
        data: data,
        xField: "month",
        yField: "value",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
            offset: 10,
        },
        meta: { value: { alias: "Количество" } },
    };

    return (
        <>
            <Row className="column-chart-title">
                <Col span={24}>
                    <h3>{title}</h3>
                </Col>
            </Row>

            <Row className="column-chart-wrapper">
                <Col span={24} className="column-chart my-chart">
                    <Column {...config} />
                </Col>
            </Row>
        </>
    );
}