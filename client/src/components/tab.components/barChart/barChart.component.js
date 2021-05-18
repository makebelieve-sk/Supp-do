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
        seriesField: "taskStatus",
        // isPercent: true,
        isStack: true,
        label: {
            position: "middle",
            content: function content(item) {
                return item.value
            },
            style: { fill: "#fff" },
        },
        barStyle: {
            cursor: "pointer"
        },
        height: 150
    };

    /**
     * Функция клика на гистограмму
     * @param event - событие мыши
     */
    const onClick = (event) => {
        if (event.type === "click" && event.data) {
            goToLogDO("/bar", event.data.data);
        }
    };

    return (
        <>
            <Row align="middle" className="bar-chart-title title">
                <Col span={24}>
                    <div className="title">Загруженность подразделений</div>
                </Col>
            </Row>

            <Row align="middle" className="content">
                <Col span={24} className="bar-chart">
                    <Bar {...config} onEvent={(chart, event) => onClick(event)} />
                </Col>
            </Row>
        </>
    );
}