// Компонент надтабличной строки
import React from "react";
import {useSelector} from "react-redux";
import {Col, Row} from "antd";
import moment from "moment";

import {SearchField} from "../searchField";
import {ButtonsComponent} from "../tableButtons";

import "./tableHeader.css";

export const TableHeaderComponent = ({table, specKey, filterText, setFilterText, setColumnsTable}) => {
    // Получение дат
    const dateObject = useSelector(state => ({
        logDO: state.reducerLogDO.date,
        rating: state.reducerStatistic.dateRating,
        list: state.reducerStatistic.dateList,
        log: state.reducerLog.dateLog,
    }));

    // Текущая дата
    const date = [moment().startOf("month"), moment().endOf("month")];

    return (
        <Row className="container" justify="space-between" align="middle" gutter={16}>
            {/*Поле поиска*/}
            <Col flex="1 1 auto" className="item">
                <SearchField filterText={filterText} setFilterText={setFilterText}/>
            </Col>

            {/*Дата с ... по ...*/}
            <Col flex="1 1 auto" className="item">
                {table.renderRangePicker(date, dateObject)}
            </Col>

            {/*Блок кнопок таблицы*/}
            <Col flex="0 1 auto">
                <ButtonsComponent
                    specKey={specKey}
                    setColumnsTable={setColumnsTable}
                    table={table}
                />
            </Col>
        </Row>
    )
}