// Компонент надтабличной строки
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Col, message, Row} from "antd";
import moment from "moment";

import {SearchField} from "../searchField";
import {RangePickerComponent} from "../rangePicker";
import {ButtonsComponent} from "../tableButtons";
import {LogDORoute} from "../../../routes/route.LogDO";
import {StatisticRatingRoute} from "../../../routes/route.StatisticRating";
import {StatisticListRoute} from "../../../routes/route.StatisticList";
import {ActionCreator} from "../../../redux/combineActions";
import tableSettings from "../../../options/tab.options/table.options/settings";
import TabOptions from "../../../options/tab.options/record.options";

import "./tableHeader.css";
import {LogRoute} from "../../../routes/route.Log";

export const TableHeaderComponent = ({data, specKey, filterText, setFilterText, setColumnsTable}) => {
    // Получение даты ЖДО и статистики в датапикер
    const {dateLogDO, dateRating, dateList, dateLog} = useSelector(state => ({
        dateLogDO: state.reducerLogDO.date,
        dateRating: state.reducerStatistic.dateRating,
        dateList: state.reducerStatistic.dateList,
        dateLog: state.reducerLog.dateLog,
    }));
    const dispatch = useDispatch();

    let date = [moment().startOf("month"), moment().endOf("month")];

    // Установка времени в датапикере
    if (specKey === "logDO" && dateLogDO) {
        date = [moment(dateLogDO.split("/")[0], TabOptions.dateFormat),
            moment(dateLogDO.split("/")[1], TabOptions.dateFormat)];
    }

    if (specKey === "statisticRating" && dateRating) {
        date = [moment(dateRating.split("/")[0], TabOptions.dateFormat),
            moment(dateRating.split("/")[1], TabOptions.dateFormat)];
    }

    if (specKey === "statisticList" && dateList) {
        date = [moment(dateList.split("/")[0], TabOptions.dateFormat),
            moment(dateList.split("/")[1], TabOptions.dateFormat)];
    }

    if (specKey === "logs" && dateLog) {
        date = [moment(dateLog.split("/")[0], TabOptions.dateFormat),
            moment(dateLog.split("/")[1], TabOptions.dateFormat)];
    }

    // Реализация экспорта
    const onExport = () => data && data.length > 0 ?
        tableSettings.export(data, specKey) : message.warning("Записи в таблице отсутствуют");

    // Изменение времени в датапикере
    const onChangeRangePicker = async (value, dateString) => {
        const date = dateString[0] + "/" + dateString[1];

        if (specKey === "logDO") {
            await LogDORoute.getAll(date);
            // Записываем текущий диапазон даты в хранилище
            dispatch(ActionCreator.ActionCreatorLogDO.setDate(date));
        }

        if (specKey === "statisticRating") {
            await StatisticRatingRoute.getAll(date);  // Обновляем записи раздела Статистика
            // Записываем текущий диапазон даты в хранилище
            dispatch(ActionCreator.ActionCreatorStatistic.setDateRating(date));
        }

        if (specKey === "statisticList") {
            await StatisticListRoute.getAll(date);  // Обновляем записи раздела Статистика
            // Записываем текущий диапазон даты в хранилище
            dispatch(ActionCreator.ActionCreatorStatistic.setDateList(date));
        }

        if (specKey === "logs") {
            await LogRoute.getAll(date);  // Обновляем записи раздела Журнал действий пользователя
            // Записываем текущий диапазон даты в хранилище
            dispatch(ActionCreator.ActionCreatorLog.setDateLog(date));
        }
    }

    return (
        <Row className="container" justify="space-between" align="middle" gutter={16}>
            {/*Поле поиска*/}
            <Col flex="1 1 auto" className="item">
                <SearchField filterText={filterText} setFilterText={setFilterText}/>
            </Col>

            {/*Дата с ... по ...*/}
            <Col flex="1 1 auto" className="item">
                <RangePickerComponent
                    isVisible={specKey === "logDO" || specKey === "statisticRating" || specKey === "statisticList" ||
                    specKey === "logs"}
                    onChange={onChangeRangePicker}
                    date={date}
                />
            </Col>

            {/*Блок кнопок таблицы*/}
            <Col flex="0 1 auto">
                <ButtonsComponent
                    specKey={specKey}
                    onExport={onExport}
                    setColumnsTable={setColumnsTable}
                />
            </Col>
        </Row>
    )
}