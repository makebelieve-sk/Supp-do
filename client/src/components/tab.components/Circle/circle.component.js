// Компонент, выводящий число в круглом блоке
import React from "react";
import {Col, Row} from "antd";

import "./circle.css";

export const CircleComponent = ({title, value, upBorder, borderColor, goToLogDO, size}) => {
    return (
        <div style={{height: size ? "50%" : "100%"}}>
            <Row className="circle-title" style={{borderTop: upBorder ? "1px solid grey" : 0, height: size ? "20%" : "10%"}}>
                <Col span={24}>
                    <h3>{title}</h3>
                </Col>
            </Row>
            <Row style={{height: size ? "80%" : "90%"}}>
                <Col span={24} className="circle-col">
                    <div
                        className="circle"
                        style={{
                            borderColor,
                            color: borderColor,
                            borderWidth: size ? "8px" : "15px",
                            fontSize: size ? "28px" : "40px",
                            width: size ? "85px" : "150px",
                            height: size ? "85px" : "150px",
                            lineHeight: size ? "69px" : "120px"
                        }}
                        // onClick={() => goToLogDO(!!!)}
                    >
                        {value}
                    </div>
                </Col>
            </Row>
        </div>
    )
}