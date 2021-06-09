// Компонент, отрисовывающий рейтинг (таблицы)
import React from "react";
import {Col, Row} from "antd";

import "./rating.css";
import {useWindowWidth} from "../../../hooks/windowWidth.hook";

export const RatingComponent = ({title, param, data}) => {
    // Определяем название класса, получая текущее значение ширины окна браузера
    const screenClass = useWindowWidth();

    return (
        <div className={`block ${screenClass}`}>
            <Row className="rating-title title">
                <Col span={24}>
                    <div className="title">{title}</div>
                </Col>
            </Row>

            <Row className="rating-table">
                <Col span={24} className="table-block">
                    <div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th className="ta-left">Оборудование</th>
                                <th className="ta-center">{param}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data && data.length
                                    ? data.map(obj => (
                                        <tr key={obj.id}>
                                            <td className="ta-left">{obj.name}</td>
                                            <td className="ta-center">{obj.value}</td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan={2} className="ta-center">Нет данных</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </div>
    )
}