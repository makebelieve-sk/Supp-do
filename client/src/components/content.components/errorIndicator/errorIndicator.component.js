// Компонент ошибки раздела (таблицы/записи)
import React from "react";
import {Button, Collapse} from "antd";
import {FrownOutlined} from "@ant-design/icons";

import store from "../../../redux/store";

import "./errorIndicator.css";

const {Panel} = Collapse;

const ErrorIndicator = ({error}) => (
    <div className="error-indicator">
        <div className="error-image"><FrownOutlined spin/></div>

        <span className="error-title">В работе данного раздела возникла ошибка</span>

        {
            typeof error === "string"
                ? null
                : <div className="go-back">
                    <Button size="large" onClick={() => store.dispatch(error.action)}>Вернуться к разделу</Button>
                </div>
        }

        <Collapse>
            <Panel header="Подробнее об ошибке">
                <span className="error-text">{typeof error === "string" ? error : error.errorText}</span>
            </Panel>
        </Collapse>
    </div>
);

export default ErrorIndicator;