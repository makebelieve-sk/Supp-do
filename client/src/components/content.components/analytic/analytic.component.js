// Компонент отображающий раздел "Аналитика"
import React from "react";
import {useSelector} from "react-redux";
import {Col, Row, Grid} from "antd";

import {LineChartComponent} from "../../tab.components/lineChart/lineChart.component";
import {BarChartComponent} from "../../tab.components/barChart/barChart.component";
import {ColumnChartComponent} from "../../tab.components/columnChart/columnChart.component";
import {CircleComponent} from "../../tab.components/Circle/circle.component";
import {RatingComponent} from "../../tab.components/rating/rating.component";

import {AnalyticRoute} from "../../../routes/route.Analytic";
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import emptyTab from "../../../helpers/functions/tabs.functions/emptyTab";
import {BodyManager} from "../body/body.component";
import ErrorIndicator from "../errorIndicator/errorIndicator.component";

import "./analytic.css";

const { useBreakpoint } = Grid; // Извлекаем хук useBreakpoint из Grid Antd

export const AnalyticComponent = () => {
    let circleSize = true;
    // Получаем текущий размер окна браузера
    const screens = useBreakpoint();

    const currentScreen = Object.entries(screens)
        .filter(screen => !!screen[1])
        .map(screen => screen[0]);

    if (currentScreen[currentScreen.length - 1] === "xs" ||
        currentScreen[currentScreen.length - 1] === "sm" ||
        currentScreen[currentScreen.length - 1] === "md" ||
        currentScreen[currentScreen.length - 1] === "lg") {
        circleSize = false;
    }

    // Получаем из хранилища объект текущий аналитики, предыдущий объект аналитики (для сравнения)
    const {analytic, prevAnalyticData, error} = useSelector(state => ({
        analytic: state.reducerAnalytic.analytic,
        prevAnalyticData: state.reducerAnalytic.prevAnalyticData,
        error: state.reducerAnalytic.error
    }));

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

    /**
     * Функция обработки перехода в раздел ЖДО
     * url - адрес
     * filter - объект фильтр
     */
    const goToLogDO = async (url, filter) => {
        try {
            // Устанавливаем показ спиннера загрузки при открытии вкладки раздела
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

            // Создаем пустую вкладку
            emptyTab("Журнал дефектов и отказов", BodyManager, "logDO");

            await AnalyticRoute.goToLogDO(url, filter);

            // Останавливаем показ спиннера загрузки при открытии вкладки раздела
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
        } catch (e) {
            // Останавливаем показ спиннера загрузки при появлении ошибки
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
        }
    };

    if (error) return <ErrorIndicator errorText={error} />

    return (
        <div className="analytic">
            <Row>
                {/*Неназначенные заявки*/}
                <Col
                    xs={24} sm={12} md={8} lg={8} xl={4}
                    className="col-circle-1"
                    onClick={() => goToLogDO("/unassignedTasks")}
                >
                    <CircleComponent
                        title="Неназначенные заявки"
                        value={analytic ? analytic.unassignedTasks : 0}
                        borderColor={analytic && prevAnalyticData &&
                        prevAnalyticData.unassignedTasks > analytic.unassignedTasks ? "red" : "green"}
                    />
                </Col>

                {/*Заявки в работе*/}
                <Col
                    xs={24} sm={12} md={8} lg={8} xl={4}
                    className="col-circle-2"
                    onClick={() => goToLogDO("/inWorkTasks")}
                >
                    <CircleComponent
                        title="Заявки в работе"
                        value={analytic ? analytic.inWorkTasks : 0}
                        borderColor={analytic && prevAnalyticData
                        && prevAnalyticData.inWorkTasks > analytic.inWorkTasks ? "red" : "green"}
                    />
                </Col>

                {/*Непринятые заявки*/}
                <Col
                    xs={24} sm={24} md={8} lg={8} xl={4}
                    className="col-circle-3"
                    onClick={() => goToLogDO("/notAccepted")}
                >
                    <CircleComponent
                        title="Непринятые заявки"
                        value={analytic ? analytic.notAccepted : 0}
                        borderColor={analytic && prevAnalyticData
                        && prevAnalyticData.notAccepted > analytic.notAccepted ? "red" : "green"}
                    />
                </Col>

                {/*Загруженность подразделений*/}
                <Col xs={24} sm={24} md={24} lg={24} xl={12} className="bar-char-border">
                    <BarChartComponent
                        data={analytic && analytic.workloadDepartments ?
                            analytic.workloadDepartments : [{department: "0", value: "0"}]}
                        goToLogDO={goToLogDO}
                    />
                </Col>
            </Row>

            <Row className="row-2">
                {/*Динамика отказов*/}
                <Col xs={24} sm={24} md={24} lg={24} xl={18} className="block-1">
                    <LineChartComponent
                        data={analytic && analytic.failureDynamics ?
                            analytic.failureDynamics : [{data: "0", value: "0"}]}
                        goToLogDO={goToLogDO}
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
                                && prevAnalyticData.averageResponseTime.length > analytic.averageResponseTime.length ? "red" : "green"}
                                size={circleSize}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={24}  className="col-circle-5">
                            <CircleComponent
                                title={"Ср. время выполнения, " + getUnits(analytic ? analytic.averageClosingTime : null)}
                                value={analytic && analytic.averageClosingTime ? analytic.averageClosingTime : 0}
                                borderColor={analytic && prevAnalyticData && analytic.averageClosingTime
                                && analytic.averageClosingTime.length
                                && prevAnalyticData.averageClosingTime && prevAnalyticData.averageClosingTime.length
                                && prevAnalyticData.averageClosingTime.length > analytic.averageClosingTime.length ? "red" : "green"}
                                size={circleSize}
                                upBorder={true}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="row-3">
                {/*Продолжительность простоев*/}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} className="col-column-1">
                    <ColumnChartComponent
                        title="Продолжительность простоев, мин"
                        data={analytic && analytic.changeDowntime ? analytic.changeDowntime : [{
                            month: "0",
                            value: "0"
                        }]}
                    />
                </Col>

                {/*Количество отказов*/}
                <Col xs={24} sm={12} md={12} lg={6} xl={6} className="col-column-2">
                    <ColumnChartComponent
                        title="Количество отказов, шт."
                        data={analytic && analytic.changeRefusal ? analytic.changeRefusal : [{month: "0", value: "0"}]}
                    />
                </Col>

                {/*Рейтинг отказов за 12 месяцев (Топ-5)*/}
                <Col
                    xs={24} sm={24} md={12} lg={6} xl={6}
                    className="col-rating-1"
                    onClick={() => goToLogDO("/rating/bounceRating")}
                >
                    <RatingComponent
                        title="Рейтинг отказов за 12 месяцев (Топ-5)"
                        param="Кол-во заявок, шт."
                        data={analytic && analytic.bounceRating ? analytic.bounceRating : null}
                    />
                </Col>

                {/*Рейтинг незакрытых заявок (Топ-5)*/}
                <Col
                    xs={24} sm={24} md={12} lg={6} xl={6}
                    className="col-rating-2"
                    onClick={() => goToLogDO("/rating/ratingOrders")}
                >
                    <RatingComponent
                        title="Рейтинг незакрытых заявок (Топ-5)"
                        param="Продол-ть, сут."
                        data={analytic && analytic.ratingOrders ? analytic.ratingOrders : null}
                    />
                </Col>
            </Row>
        </div>
    )
}