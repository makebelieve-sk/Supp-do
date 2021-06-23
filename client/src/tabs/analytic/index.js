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
import ErrorIndicator from "../../components/content.components/errorIndicator/errorIndicator.component";

import "./analytic.css";
import {LogDOSection} from "../../sections/logDOSection";

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
        emptyTab("Журнал дефектов и отказов", BodyManager, "logDO", LogDOSection);

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
    const {analytic, prevAnalyticData, errorAnalytic} = useSelector(state => state.reducerAnalytic);

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

    // Инициализация ошибки раздела "Аналитика"
    const error = errorAnalytic
        ? {
            errorText: errorAnalytic,
            action: ActionCreator.ActionCreatorAnalytic.setErrorAnalytic(null)
        }
        : null;

    return error
        ? <ErrorIndicator error={error}/>
        : <div className="analytic">
            {/*Компонент, отрисовывающий кнопку печати*/}
            <Row justify="end">
                <Col>
                    <PrintButton short={short} getContent={getContent} table={null} />
                </Col>
            </Row>

            {/*Компонент, отрисовывающий дашбоард*/}
            <Dashboard analytic={analytic} prevAnalyticData={prevAnalyticData} currentScreen={currentScreen} />
        </div>
}