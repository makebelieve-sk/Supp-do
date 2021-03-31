import React from "react";
import {Col, Row} from "antd";
import {Column} from '@ant-design/charts';

import "./columnChart.css";

export const ColumnChartComponent = ({title, data}) => {

    const config = {
        data: data,
        xField: "type",
        yField: "sales",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
        },
        meta: {
            type: { alias: "1" },
            sales: { alias: "2" },
        },
    };

    return <>
        <Row className="column-chart-title">
            <Col span={24}><h3>{title}</h3></Col></Row>
        <Row className="column-chart-wrapper"><Col span={24} className="column-chart my-chart"><Column {...config} /></Col></Row>
    </>;
}