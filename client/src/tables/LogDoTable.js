// Класс таблицы раздела "Журнал дефектов и отказов"
import React from "react";
import {Alert, Badge, Col, Row} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import moment from "moment";

import BaseTable from "./BaseTable";
import {LogDOTab} from "../tabs/logDo";
import {LogDORoute} from "../routes/route.LogDO";
import store from "../redux/store";
import {headerLogDO} from "../options/tab.options/table.options/exportHeaders";
import {ActionCreator} from "../redux/combineActions";
import TabOptions from "../options/tab.options/record.options";
import {RangePickerComponent} from "../components/tab.components/rangePicker";

export default class LogDOTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Журнал дефектов и отказов";
    }

    get header() {
        return headerLogDO;
    }

    get style() {
        return "left";
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "files", "sendEmail", "productionCheck", "downtime", "acceptTask", "dateDone",
            "equipmentTooltip", "departmentTooltip", "chooseResponsibleTime", "chooseStateTime", "color", "content"];

        // Инициализируем заголовок таблицы
        const headers = {
            date: "Дата заявки",
            equipment: "Оборудование",
            notes: "Описание",
            applicant: "Заявитель",
            responsible: "Испонитель",
            department: "Подразделение",
            task: "Задание",
            taskStatus: "Состояние",
            planDateDone: "Плановая дата выполнения"
        };

        // Создаем копию данных
        const copyData = [];

        if (this.data && this.data.length) {
            this.data.forEach(obj => {
                const copyObject = Object.assign({}, obj);
                copyData.push(copyObject);
            });
        }

        copyData.forEach(obj => {
            unUsedKeys.forEach(key => {
                delete obj[key];
            });
        });

        super.export(this.title, copyData, headers);
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerLogDO.logDO
        }
    }

    async onChangeRangePicker(value, dateString) {
        const date = dateString[0] + "/" + dateString[1];

        await LogDORoute.getAll(date);

        // Записываем текущий диапазон даты в хранилище
        store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(date));
    }

    renderRangePicker(date, dateObject) {
        if (dateObject["logDO"]) {
            date = [
                moment(dateObject["logDO"].split("/")[0], TabOptions.dateFormat),
                moment(dateObject["logDO"].split("/")[1], TabOptions.dateFormat)
            ];
        }

        return (
            <RangePickerComponent
                onChange={this.onChangeRangePicker}
                date={date}
            />
        )
    }

    async closeAlert() {
        // Обновляем фильтр таблицы
        store.dispatch(ActionCreator.ActionCreatorLogDO.setAlert({
            alert: null,
            filter: null,
            url: null
        }));

        // Обновляем датапикер
        store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(moment().startOf("month").format(TabOptions.dateFormat) + "/" +
            moment().endOf("month").format(TabOptions.dateFormat)));

        await LogDORoute.getAll();              // Обновляем данные в таблице
    }

    renderAlert(alert) {
        return alert && alert.alert
            ? <Row className="row-alert">
                <Col>
                    <Alert
                        message={alert.alert}
                        type="warning"
                        icon={<FilterOutlined/>}
                        showIcon
                        closable
                        onClose={this.closeAlert}
                    />
                </Col>
            </Row>
            : null
    }

    renderBadge(legend) {
        return legend && legend.length
            ? <Row className="row-badges">
                {legend.map(legend => (
                    <Col key={legend.id} className="col-badge">
                        <Badge
                            className="badge"
                            count={`${legend.name} ${legend.count}`}
                            style={{
                                backgroundColor: legend.color,
                                borderColor: legend.borderColor ?  legend.borderColor : null,
                            }}
                            onClick={async () => await LogDORoute.getRecordsWithStatus(
                                store.getState().reducerLogDO.date,
                                typeof legend.id === "number" ? null : legend.id
                            )}
                        />
                    </Col>
                ))}
            </Row>
            : null
    }

    render() {
        const options = {
            createTitle: "Создание записи в журнале дефектов и отказов",
            editTitle: "Редактирование записи в журнале дефектов и отказов",
            tab: LogDOTab,
            tabKey: "logDOItem",
            modelRoute: LogDORoute
        };

        return super.render(options);
    }
}