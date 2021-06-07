// Компонент, отрисовывающий лого
import React from "react";
import moment from "moment";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import TabOptions from "../../../options/tab.options/record.options";
import OpenTableTab from "../../../helpers/functions/tabs.functions/openTableTab";
import {LogDORoute} from "../../../routes/route.LogDO";

import logo from "../../../assets/logo.png";
import "./logo.css";

export const LogoComponent = ({collapsed}) => {
    // Обработка клика на лого
    const onLogoClick = () => {
        // Обновляем датапикер
        store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(
            moment().startOf("month").format(TabOptions.dateFormat) + "/" +
            moment().endOf("month").format(TabOptions.dateFormat)
        ));

        // Переоткрытие вкладки "Журнал дефектов и отказов"
        OpenTableTab("Журнал дефектов и отказов", "logDO", LogDORoute);
    };

    return (
        <div className="logo" onClick={onLogoClick}>
            <img src={logo} alt="Лого" className="logo-image"/>

            {collapsed ? null : "СУПП ДО"}
        </div>
    )
};