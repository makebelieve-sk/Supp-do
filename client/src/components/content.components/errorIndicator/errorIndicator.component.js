import React from "react";
import {FrownOutlined} from "@ant-design/icons";

import "./errorIndicator.css";

const ErrorIndicator = ({errorText}) => {
    return (
        <div className="error-indicator">
            <div className="error-image"><FrownOutlined spin /></div>
            <span className="error-title">В работе данного раздела возникла ошибка</span>
            <span className="error-text">{errorText}</span>
        </div>
    )
};

export default ErrorIndicator;