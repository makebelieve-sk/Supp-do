import React, {useState} from "react";

import "./tableAlert.css";
import {Alert, Col, Row} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import moment from "moment";
import TabOptions from "../../../options/tab.options/record.options/record.options";
import {LogDORoute} from "../../../routes/route.LogDO";

export const TableAlertComponent = ({alert, specKey}) => {
    // Инициализация состояний для отступа снизу алерта
    const [marginBottomAlert, setMarginBottomAlert] = useState("20px");

    /**
     * Функция закрытия алерта
     * @returns {Promise<void>}
     */
    const closeAlert = async () => {
        setMarginBottomAlert("0px");      // Убираем отступ после алерта
        store.dispatch(ActionCreator.ActionCreatorLogDO.setAlert(null));    // Обновляем фильтр таблицы
        // Обновляем датапикер
        store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(moment().startOf("month").format(TabOptions.dateFormat) + "/" +
            moment().endOf("month").format(TabOptions.dateFormat)));
        await LogDORoute.getAll();              // Обновляем данные в таблице
    }

    return alert && specKey === "logDO"
        ? <Row style={{marginBottom: marginBottomAlert}}>
            <Col>
                <Alert
                    message={alert}
                    type="warning"
                    icon={<FilterOutlined/>}
                    showIcon
                    closable
                    onClose={closeAlert}
                />
            </Col>
        </Row>
        : null
}