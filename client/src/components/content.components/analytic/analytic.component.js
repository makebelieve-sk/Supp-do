import React from "react";
import {Col, Row} from "antd";

import "./analytic.css";
import {LineChartComponent} from "../../tab.components/lineChart/lineChart.component";
import {BarChartComponent} from "../../tab.components/barChart/barChart.component";
import {ColumnChartComponent} from "../../tab.components/columnChart/columnChart.component";
import {CircleComponent} from "../../tab.components/Circle/circle.component";
import {RatingComponent} from "../../tab.components/rating/rating.component";

const data = [
    {
        type: 'Январь 2021',
        sales: 38,
    },
    {
        type: 'Февраль 2021',
        sales: 52,
    },
    {
        type: 'Март 2021',
        sales: 61,
    },
    {
        type: 'Апрель 2021',
        sales: 145,
    }
];
const data2 = [
    {
        type: 'Январь 2021',
        sales: 42,
    },
    {
        type: 'Февраль 2021',
        sales: 61,
    },
    {
        type: 'Март 2021',
        sales: 38,
    },
    {
        type: 'Апрель 2021',
        sales: 122,
    }
];

export const AnalyticComponent = () => {
    return (
        <div className="analytic">
            <Row className="row-1"><Col><b>СОСТОЯНИЕ НА ТЕКУЩИЙ МОМЕНТ</b></Col></Row>

            <Row className="row-2">
                <Col span={4} className="col-circle-1">
                    <CircleComponent title="Неназначенные заявки" value={30} borderColor="red" mt="12.5%" upBorder={false} size="150px" lh="110px" bw="20px" fs="50px"/></Col>
                <Col span={4} className="col-circle-2">
                    <CircleComponent title="Заявки в работе" value={50} borderColor="green" mt="12.5%" upBorder={false} size="150px" lh="110px" bw="20px" fs="50px"/></Col>
                <Col span={4} className="col-circle-3">
                    <CircleComponent title="Непринятые заявки" value={30} borderColor="red" mt="12.5%" upBorder={false} size="150px" lh="110px" bw="20px" fs="50px"/></Col>
                <Col span={12} className="bar-char-border"><BarChartComponent /></Col>
            </Row>

            <Row className="row-3"><Col><b>СОСТОЯНИЕ НА ТЕКУЩИЙ МЕСЯЦ</b></Col></Row>

            <Row className="row-4">
                <Col span={18}><LineChartComponent /></Col>
                <Col span={6}>
                    <CircleComponent title="Ср. время реагирования, час" value={6.8} borderColor="red" mt="1.171875%" upBorder={false} size="100px" lh="80px" bw="10px" fs="32px"/>
                    <CircleComponent title="Ср. время выполнения, сут." value={2.4} borderColor="red" mt="1.171875%" upBorder={true} size="100px" lh="80px" bw="10px" fs="32px"/>
                </Col>
            </Row>

            <Row className="row-5"><Col><b>СРАВНЕНИЕ ПЕРИОДОВ</b></Col></Row>

            <Row className="row-6">
                <Col span={6} className="col-column-1"><ColumnChartComponent title="Изменение простоев, час" data={data}/></Col>
                <Col span={6} className="col-column-2"><ColumnChartComponent title="Изменение отказов, шт." data={data2} /></Col>
                <Col span={6} className="col-rating-1">
                    <RatingComponent title="Рейтинг отказов за 12 месяцев (Топ-5)" param="Кол-во заявок, шт"/></Col>
                <Col span={6} className="col-rating-2">
                    <RatingComponent title="Рейтинг незакрытых заявок (Топ-5)"  param="Продол-ть, сут"/></Col>
            </Row>
        </div>
    )
}