// Компонент отображающий рейтинг (таблицы)
import React from "react";

import "./rating.css";
import {Col, Row} from "antd";

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
                        <table border="1" className="table">
                            <thead>
                            <tr>
                                <th style={{textAlign: "center"}}>Оборудование</th>
                                <th style={{textAlign: "center"}}>{param}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data && data.length
                                    ? data.map(obj => (
                                        <tr key={obj.id}>
                                            <td style={{textAlign: "center"}}>{obj.name}</td>
                                            <td style={{textAlign: "center"}}>{obj.value}</td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan={2} style={{textAlign: "center"}}>Нет данных</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </>
    )
}