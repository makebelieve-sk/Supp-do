// Компонент линейной диаграммы
import React from "react";
import {Col, Row} from "antd";
import {Column} from "@ant-design/charts";

import "./lineChart.css";

export const LineChartComponent = ({data, goToLogDO, print}) => {
    // Объект настроек графика
    const config = {
        data: data,
        xField: "date",
        yField: "value",
        xAxis: {label: {autoRotate: false}},
        // scrollbar: {type: "horizontal"},
        point: {
            size: 5,
            shape: "diamond",
            style: {
                fill: "white",
                stroke: "#5B8FF9",
                lineWidth: 2,
            },
        },
        tooltip: {showMarkers: false},
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
        interactions: [{type: "marker-active"}],
        meta: {value: {alias: "Количество"}},
        lineStyle: {
            cursor: "pointer"
        },
        label: {
            position: "middle",
            layout: [
                { type: "interval-adjust-position" },
                { type: "interval-hide-overlap" },
                { type: "adjust-color" },
            ],
        },
        height: 200,
        columnStyle: {
            cursor: "pointer"
        },
        width: print ? 750 : 400
    };

    /**
     * Функция клика на линейную диаграмму
     * @param event - событие мыши
     */
    const onClick = (event) => {
        if (event.type === "click" && event.data && event.data.data && +event.data.data.value) {
            goToLogDO("/line", event.data.data);
        }
    }

    return (
        <>
            <Row className="line-chart-title title">
                <Col span={24}>
                    <div className="title">Динамика отказов</div>
                </Col>
            </Row>

            <Row>
                <Col span={24} className="line-chart">
                    <Column {...config} onEvent={(chart, event) => onClick(event)} />
                </Col>
            </Row>
        </>
    );
}