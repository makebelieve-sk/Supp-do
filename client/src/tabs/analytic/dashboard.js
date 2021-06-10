// Компонент, отрисовывающий дашбоард
import React from "react";
import {Col, message, Row} from "antd";
import moment from "moment";

import {goToLogDO} from "./index";
import {CircleComponent} from "../../components/tab.components/Circle";
import {BarChartComponent} from "../../components/tab.components/barChart";
import {LineChartComponent} from "../../components/tab.components/lineChart";
import {ColumnChartComponent} from "../../components/tab.components/columnChart";
import {RatingComponent} from "../../components/tab.components/rating";

export default class Dashboard extends React.Component {
    render() {
        const {analytic, prevAnalyticData, currentScreen, print} = this.props;

        // Рассчитываем размер круга
        let circleSize = true;
        if (currentScreen && (currentScreen[currentScreen.length - 1] === "xs" ||
            currentScreen[currentScreen.length - 1] === "sm" || currentScreen[currentScreen.length - 1] === "md" ||
            currentScreen[currentScreen.length - 1] === "lg")) circleSize = false;

        // Рассчитываем текущую дату (дд:мм)
        const currentDate = moment().date() + moment().month().toString().length === 1
            ? `0${+moment().month() + 1}`
            : +moment().month() + 1;

        /**
         * Функция расчета единиц измерения
         * @param field - поле объекта аналитики
         * @returns {string} - единицы измерения
         */
        const getUnits = (field) => {
            return analytic && field
                ? field.toString().length === 2
                    ? "мин"
                    : field.toString().length === 5
                        ? "чч:мм"
                        : "сут"
                : "сут";
        }

        const classNameColTwo = print ? "print-col-2" : "";

        return (
            <>
                <Row>
                    {/*Неназначенные заявки*/}
                    <Col
                        xs={24} sm={print ? 8 : 12} md={8} lg={8} xl={4}
                        className="col-circle-1"
                        onClick={() =>
                            analytic && analytic.unassignedTasks ? goToLogDO("/unassignedTasks") : message.warning("Записей нет")}
                    >
                        <CircleComponent
                            title="Неназначенные заявки"
                            value={analytic && analytic.unassignedTasks ? analytic.unassignedTasks : 0}
                            borderColor={analytic && prevAnalyticData &&
                            prevAnalyticData.unassignedTasks < analytic.unassignedTasks ? "red" : "green"}
                        />
                    </Col>

                    {/*Заявки в работе*/}
                    <Col
                        xs={24} sm={print ? 8 : 12} md={8} lg={8} xl={4}
                        className={`col-circle-2 ${classNameColTwo}`}
                        onClick={() => analytic && analytic.inWorkTasks ? goToLogDO("/inWorkTasks") : message.warning("Записей нет")}
                    >
                        <CircleComponent
                            title="Заявки в работе"
                            value={analytic && analytic.inWorkTasks ? analytic.inWorkTasks : 0}
                            borderColor={analytic && prevAnalyticData
                            && prevAnalyticData.inWorkTasks < analytic.inWorkTasks ? "red" : "green"}
                        />
                    </Col>

                    {/*Непринятые заявки*/}
                    <Col
                        xs={24} sm={print ? 8 : 24} md={8} lg={8} xl={4}
                        className="col-circle-3"
                        onClick={() => analytic && analytic.notAccepted ? goToLogDO("/notAccepted") : message.warning("Записей нет")}
                    >
                        <CircleComponent
                            title="Непринятые заявки"
                            value={analytic && analytic.notAccepted ? analytic.notAccepted : 0}
                            borderColor={analytic && prevAnalyticData
                            && prevAnalyticData.notAccepted < analytic.notAccepted ? "red" : "green"}
                        />
                    </Col>

                    {/*Загруженность подразделений*/}
                    <Col xs={24} sm={24} md={24} lg={24} xl={12} className="bar-char-border">
                        <BarChartComponent
                            data={analytic && analytic.workloadDepartments
                                ? analytic.workloadDepartments
                                : [{department: currentDate, value: 0}]}
                            goToLogDO={goToLogDO}
                            print={print}
                        />
                    </Col>
                </Row>

                <Row className="row-2">
                    {/*Динамика отказов*/}
                    <Col xs={24} sm={24} md={24} lg={24} xl={18} className="block-1">
                        <LineChartComponent
                            data={analytic && analytic.failureDynamics ?
                                analytic.failureDynamics : [{data: currentDate, value: 0}]}
                            goToLogDO={goToLogDO}
                            print={print}
                        />
                    </Col>

                    {/*Ср. время реагирования, Ср. время выполнения*/}
                    <Col xs={24} sm={24} md={24} lg={24} xl={6} className="block-2">
                        <Row style={{height: "100%"}}>
                            <Col xs={24} sm={12} md={12} lg={12} xl={24} className="col-circle-4">
                                <CircleComponent
                                    title={"Ср. время реагирования, " + getUnits(analytic ? analytic.averageResponseTime : null)}
                                    value={analytic && analytic.averageResponseTime ? analytic.averageResponseTime : 0}
                                    borderColor={analytic && prevAnalyticData && analytic.averageResponseTime
                                    && analytic.averageResponseTime.length
                                    && prevAnalyticData.averageResponseTime && prevAnalyticData.averageResponseTime.length
                                    && prevAnalyticData.averageResponseTime.length < analytic.averageResponseTime.length
                                        ? "red" : "green"}
                                    size={circleSize}
                                />
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={24} className="col-circle-5">
                                <CircleComponent
                                    title={"Ср. время выполнения, " + getUnits(analytic ? analytic.averageClosingTime : null)}
                                    value={analytic && analytic.averageClosingTime ? analytic.averageClosingTime : 0}
                                    borderColor={analytic && prevAnalyticData && analytic.averageClosingTime
                                    && analytic.averageClosingTime.length
                                    && prevAnalyticData.averageClosingTime && prevAnalyticData.averageClosingTime.length
                                    && prevAnalyticData.averageClosingTime.length < analytic.averageClosingTime.length
                                        ? "red" : "green"}
                                    size={circleSize}
                                    upBorder={true}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {
                    print ? <><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></> : null
                }

                <Row className="row-3">
                    {/*Продолжительность простоев*/}
                    <Col xs={24} sm={12} md={12} lg={6} xl={6} className="col-column-1">
                        <ColumnChartComponent
                            title="Продолжительность простоев, мин"
                            data={analytic && analytic.changeDowntime ? analytic.changeDowntime : [{
                                month: moment().format("MMMM")[0].toUpperCase() +
                                    moment().format("MMMM").slice(1, 3) + ". " + moment().format("YYYY"),
                                value: 0
                            }]}
                        />
                    </Col>

                    {/*Количество отказов*/}
                    <Col xs={24} sm={12} md={12} lg={6} xl={6} className="col-column-2">
                        <ColumnChartComponent
                            title="Количество отказов, шт."
                            data={analytic && analytic.changeRefusal ? analytic.changeRefusal : [{
                                month: moment().format("MMMM")[0].toUpperCase() +
                                    moment().format("MMMM").slice(1, 3) + ". " + moment().format("YYYY"),
                                value: 0
                            }]}
                        />
                    </Col>

                    {/*Рейтинг отказов за 12 месяцев (Топ-5)*/}
                    <Col
                        xs={24} sm={print ? 12 : 24} md={12} lg={6} xl={6}
                        className="col-rating-1"
                        onClick={() =>
                            analytic && analytic.bounceRating ? goToLogDO("/rating/bounceRating") : message.warning("Записей нет")}
                    >
                        <RatingComponent
                            title="Рейтинг отказов за 12 месяцев (Топ-5)"
                            param="Кол-во заявок, шт."
                            data={analytic && analytic.bounceRating ? analytic.bounceRating : null}
                        />
                    </Col>

                    {/*Рейтинг незакрытых заявок (Топ-5)*/}
                    <Col
                        xs={24} sm={print ? 12 : 24} md={12} lg={6} xl={6}
                        className="col-rating-2"
                        onClick={() =>
                            analytic && analytic.ratingOrders ? goToLogDO("/rating/ratingOrders"): message.warning("Записей нет")}
                    >
                        <RatingComponent
                            title="Рейтинг незакрытых заявок (Топ-5)"
                            param="Продол-ть, сут."
                            data={analytic && analytic.ratingOrders ? analytic.ratingOrders : null}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}