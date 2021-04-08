// Компонент гистограммы
import React from "react";
import {Col, Row} from "antd";
import {Bar} from '@ant-design/charts';

import "./barChart.css";

export const BarChartComponent = ({data, goToLogDO}) => {
    // Объект настроек графика
    const config = {
        data: data,
        xField: "value",
        yField: "department",
        seriesField: "state",
        // isPercent: true,
        isStack: true,
        label: {
            position: "middle",
            content: function content(item) {
                return item.value
            },
            style: { fill: "#fff" },
        },
    };

    /**
     * Функция клика на гистограмму
     * @param event - событие мыши
     */
    const onClick = (event) => {
        if (event.type === "click") goToLogDO("/bar", event.data.data);
    }

    return (
        <>
            <Row className="bar-chart-title">
                <Col span={24}>
                    <h3>Загруженность подразделений</h3>
                </Col>
            </Row>

            <Row className="content">
                <Col span={24} className="bar-chart my-chart">
                    <Bar {...config} onEvent={(chart, event) => onClick(event)} />
                </Col>
            </Row>
        </>
    );
}