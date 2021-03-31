import React from "react";
import {Col, Row} from "antd";

import "./circle.css";

export const CircleComponent = ({title, value, borderColor, mt, upBorder, size, lh, bw, fs}) => {
    return (
        <div className="circle-component">
            <Row className="circle-title" style={{borderTop: upBorder ? "1px solid grey" : 0}}>
                <Col span={24}><h3>{title}</h3></Col></Row>
            <Row className="circle-wrapper" style={{marginTop: mt ? mt : 0}}>
                <Col span={24}><div className="circle" style={{borderColor, color: borderColor, width: size, height: size, lineHeight: lh, borderWidth: bw, fontSize: fs}}>{value}</div></Col></Row>
        </div>
    )
}