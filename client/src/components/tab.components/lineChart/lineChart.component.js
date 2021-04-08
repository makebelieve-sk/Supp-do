// Компонент линейной диаграммы
import React from "react";
import {Col, Row} from "antd";
import {Line} from "@ant-design/charts";

import "./lineChart.css";

export const LineChartComponent = ({data, goToLogDO}) => {
    // Объект настроек графика
    const config = {
        data: data,
        xField: "date",
        yField: "value",
        label: {},
        point: {
            size: 5,
            shape: "diamond",
            style: {
                fill: "white",
                stroke: "#5B8FF9",
                lineWidth: 2,
            },
        },
        tooltip: { showMarkers: false },
        state: {
            active: {
                style: {
                    shadowColor: "yellow",
                    shadowBlur: 4,
                    stroke: "transparent",
                    fill: "red",
                },
            },
        },
        theme: {
            geometries: {
                point: {
                    diamond: {
                        active: {
                            style: {
                                shadowColor: "#FCEBB9",
                                shadowBlur: 2,
                                stroke: "#F6BD16",
                            },
                        },
                    },
                },
            },
        },
        interactions: [{ type: "marker-active" }],
        meta: { value: { alias: "Количество" } },
    };

    /**
     * Функция клика на линейную диаграмму
     * @param event - событие мыши
     */
    const onClick = (event) => {
        if (event.type === "click" && event.data && !Array.isArray(event.data.data))
            goToLogDO("/line", event.data.data);
    }

    return (
        <>
            <Row className="line-chart-title">
                <Col span={24}>
                    <h3>Динамика отказов</h3>
                </Col>
            </Row>

            <Row className="line-chart-wrapper">
                <Col span={24} className="line-chart my-chart">
                    <Line {...config} onEvent={(chart, event) => onClick(event)} />
                </Col>
            </Row>
        </>
    );
}