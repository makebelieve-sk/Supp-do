import React from "react";
import {Collapse} from "antd";
import {FrownOutlined} from "@ant-design/icons";

import "./errorIndicator.css";

const { Panel } = Collapse;

const ErrorIndicator = ({errorText}) => {
    return (
        <div className="error-indicator">
            <div className="error-image"><FrownOutlined spin/></div>
            <span className="error-title">В работе данного раздела возникла ошибка</span>
            <Collapse>
                <Panel header="Подробнее об ошибке">
                    <span className="error-text">{errorText}</span>
                </Panel>
            </Collapse>
        </div>
    )
};

export default ErrorIndicator;