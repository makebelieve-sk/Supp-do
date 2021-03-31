import React from "react";
import {Col, Row} from "antd";
import {Line} from "@ant-design/charts";

import "./lineChart.css";

export const LineChartComponent = () => {
    const data = [
        {
            year: '1',
            value: 10,
        },
        {
            year: '2',
            value: 2,
        },
        {
            year: '3',
            value: 5,
        },
        {
            year: '4',
            value: 7,
        },
        {
            year: '5',
            value: 8,
        },
        {
            year: '6',
            value: 3,
        },
        {
            year: '7',
            value: 5,
        },
        {
            year: '8',
            value: 7,
        },
        {
            year: '9',
            value: 12,
        },
        {
            year: '10',
            value: 5,
        },
        {
            year: '11',
            value: 3,
        },
        {
            year: '12',
            value: 4,
        },
        {
            year: '13',
            value: 2,
        },
        {
            year: '14',
            value: 7,
        },
        {
            year: '15',
            value: 9,
        },
        {
            year: '16',
            value: 2,
        },
        {
            year: '17',
            value: 7,
        },
        {
            year: '18',
            value: 5,
        },
        {
            year: '19',
            value: 6,
        },
        {
            year: '20',
            value: 7,
        },
        {
            year: '21',
            value: 1,
        },
        {
            year: '22',
            value: 4,
        },
        {
            year: '23',
            value: 3.5,
        },
        {
            year: '24',
            value: 5,
        },
        {
            year: '25',
            value: 4.9,
        },
        {
            year: '26',
            value: 3,
        },
        {
            year: '27',
            value: 4,
        },
        {
            year: '28',
            value: 3.5,
        },
        {
            year: '29',
            value: 5,
        },
        {
            year: '30',
            value: 4.9,
        },
    ];

    const config = {
        data: data,
        xField: "year",
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
    };

    return <>
        <Row className="line-chart-title">
            <Col span={24}>
                <h3>Динамика отказов</h3>
            </Col>
        </Row>
        <Row className="line-chart-wrapper">
            <Col span={24} className="line-chart my-chart">
                <Line {...config} />
            </Col>
        </Row>
    </>;
}