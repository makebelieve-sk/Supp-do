// Компонент отображающий рейтинг (таблицы)
import React from "react";
import {Col, Row} from "antd";

import "./rating.css";

export const RatingComponent = ({title, param, data}) => {
    return (
        <>
            <Row className="rating-title">
                <Col span={24}>
                    <h3>{title}</h3>
                </Col>
            </Row>

            <Row className="rating-table">
                <Col span={24} className="table-block">
                    <div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th className="ta-center">Оборудование</th>
                                <th className="ta-center">{param}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data && data.length
                                    ? data.map(obj => (
                                        <tr key={obj.id}>
                                            <td className="ta-center">{obj.name}</td>
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
        </>
    )
}