import React from "react";
import {Col, Row} from "antd";
import {Bar} from '@ant-design/charts';

import "./barChart.css";

export const BarChartComponent = () => {
    const data = [
        {
            country: 'Выполнено',
            year: 'АСУТП',
            value: 502,
        },
        {
            country: 'В работе',
            year: 'АСУТП',
            value: 304,
        },
        {
            country: 'Принято',
            year: 'АСУТП',
            value: 709,
        },
        {
            country: 'Комплектация',
            year: 'АСУТП',
            value: 100,
        },
        {
            country: 'На остановку',
            year: 'АСУТП',
            value: 98,
        },
        {
            country: 'Не выявлено',
            year: 'АСУТП',
            value: 98,
        },

        {
            country: 'Выполнено',
            year: 'Цех',
            value: 1004,
        },
        {
            country: 'В работе',
            year: 'Цех',
            value: 1300,
        },
        {
            country: 'Принято',
            year: 'Цех',
            value: 400,
        },
        {
            country: 'Комплектация',
            year: 'Цех',
            value: 350,
        },
        {
            country: 'На остановку',
            year: 'Цех',
            value: 210,
        },
        {
            country: 'Не выявлено',
            year: 'Цех',
            value: 112,
        },

        {
            country: 'Выполнено',
            year: 'ОГЭ',
            value: 1004,
        },
        {
            country: 'В работе',
            year: 'ОГЭ',
            value: 1300,
        },
        {
            country: 'Принято',
            year: 'ОГЭ',
            value: 400,
        },
        {
            country: 'Комплектация',
            year: 'ОГЭ',
            value: 350,
        },
        {
            country: 'На остановку',
            year: 'ОГЭ',
            value: 210,
        },
        {
            country: 'Не выявлено',
            year: 'ОГЭ',
            value: 112,
        },

        {
            country: 'Выполнено',
            year: 'ОГМ',
            value: 700,
        },
        {
            country: 'В работе',
            year: 'ОГМ',
            value: 1300,
        },
        {
            country: 'Принято',
            year: 'ОГМ',
            value: 500,
        },
        {
            country: 'Комплектация',
            year: 'ОГМ',
            value: 350,
        },
        {
            country: 'На остановку',
            year: 'ОГМ',
            value: 130,
        },
        {
            country: 'Не выявлено',
            year: 'ОГМ',
            value: 629,
        },
    ];

    const config = {
        data: data,
        xField: "value",
        yField: "year",
        seriesField: "country",
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

    return <>
        <Row className="bar-chart-title">
            <Col span={24}><h3>Загруженность подразделений</h3></Col></Row>
        <Row><Col span={24} className="bar-chart my-chart"><Bar {...config} /></Col></Row>
    </>;
}