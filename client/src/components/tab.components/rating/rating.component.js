import React from "react";

import "./rating.css";
import {Col, Row} from "antd";

export const RatingComponent = ({title, param}) => {
    return (
        <>
            <Row className="rating-title">
                <Col span={24}><h3>{title}</h3></Col></Row>
            <Row className="rating-table">
                <Col span={24}>
                    <table style={{width: "100%", fontSize: "18px"}}>
                        <thead>
                            <tr>
                                <th style={{textAlign: "center"}}>Оборудование</th>
                                <th style={{textAlign: "center"}}>{param}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Дозатор цемента</td>
                                <td style={{textAlign: "center"}}>100</td>
                            </tr>
                            <tr>
                                <td>Дозатор извести</td>
                                <td style={{textAlign: "center"}}>90</td>
                            </tr>
                            <tr>
                                <td>Дозатор гипса</td>
                                <td style={{textAlign: "center"}}>80</td>
                            </tr>
                            <tr>
                                <td>Дозатор золы</td>
                                <td style={{textAlign: "center"}}>70</td>
                            </tr>
                            <tr>
                                <td>Дозатор шлама</td>
                                <td style={{textAlign: "center"}}>60</td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    )
}