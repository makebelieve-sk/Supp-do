// Компонент отображающий раздел "Аналитика"
import React from "react";
import {useSelector} from "react-redux";
import {Col, Grid, Row} from "antd";

import {AnalyticRoute} from "../../routes/route.Analytic";
import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import emptyTab from "../../helpers/functions/tabs.functions/emptyTab";
import {BodyManager} from "../../components/content.components/body/body.component";
import {useWindowWidth} from "../../hooks/windowWidth.hook";
import Dashboard from "./dashboard";
import PrintButton from "../../components/tab.components/tableButtons/printButton";

import "./analytic.css";

/**
 * Функция обработки перехода в раздел ЖДО
 * url - адрес
 * filter - объект фильтр
 */
export const goToLogDO = async (url, filter) => {
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

export const AnalyticComponent = () => {
    // Получаем из хранилища объект текущий аналитики, предыдущий объект аналитики (для сравнения)
    const {analytic, prevAnalyticData} = useSelector(state => ({
        analytic: state.reducerAnalytic.analytic,
        prevAnalyticData: state.reducerAnalytic.prevAnalyticData
    }));

    // Получаем текущее значение ширины окна браузера
    const screen = useWindowWidth();
    // Получение контента кнопки в зависимости от ширины экрана
    const getContent = (content) => screen !== "xs" && screen !== "sm" && screen !== "md" ? content : null;
    const short = screen === "xs" || screen === "sm" || screen === "md" ? "short" : "";

    // Получаем текущий размер окна браузера
    const screens = Grid.useBreakpoint();
    const currentScreen = Object.entries(screens)
        .filter(screen => !!screen[1])
        .map(screen => screen[0]);

    return (
        <div className="analytic">
            {/*Компонент, отрисовывающий кнопку печати*/}
            <Row justify="end">
                <Col>
                    <PrintButton headers={null} specKey="analytic" short={short} getContent={getContent}/>
                </Col>
            </Row>

            {/*Компонент, отрисовывающий дашбоард*/}
            <Dashboard analytic={analytic} prevAnalyticData={prevAnalyticData} currentScreen={currentScreen} />
        </div>
    )
}