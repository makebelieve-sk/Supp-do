// Компонент, выводящий число в круглом блоке
import React from "react";
import {Col, Row} from "antd";

import {useWindowWidth} from "../../../hooks/windowWidth.hook";

import "./circle.css";

export const CircleComponent = ({title, value, borderColor = "green", size = false, upBorder = false}) => {
    // Определяем название класса, получая текущее значение ширины окна браузера
    const screenClass = useWindowWidth();

    const circleSizeClass = size ? "circle-small" : "circle";   // Класс для круга
    const titleSizeClass = size ? "title-small" : "title";  // Класс для заголовка
    const bodySizeClass = size ? "body-small" : "body"; // Класс для тела компонента
    const upBorderClass = upBorder ? "upBorder" : ""; // Класс для верхней границы компонента

    return (
        <div className={`block ${screenClass}`}>
            <Row align="middle" className={`circle-title ${titleSizeClass} ${upBorderClass}`}>
                <Col span={24}>
                    <div className="title">{title}</div>
                </Col>
            </Row>

            <Row className={bodySizeClass}>
                <Col span={24} className="circle-col">
                    <div className={`${circleSizeClass} ${borderColor}`}>
                        {value}
                    </div>
                </Col>
            </Row>
        </div>
    )
}