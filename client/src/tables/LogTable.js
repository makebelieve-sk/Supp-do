// Класс таблицы раздела "Журнал действий пользователей"
import moment from "moment";
import React from "react";
import {Button, Popconfirm} from "antd";
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import BaseTable from "./BaseTable";
import {LogTab} from "../tabs/log";
import {LogRoute} from "../routes/route.Log";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import TabOptions from "../options/tab.options/record.options";
import {RangePickerComponent} from "../components/tab.components/rangePicker";
import {checkRoleUser} from "../helpers/mappers/general.mappers/checkRoleUser";
import {headerLog} from "../options/tab.options/table.options/exportHeaders";

export default class LogTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    async onChangeRangePicker(value, dateString) {
        const date = dateString[0] + "/" + dateString[1];

        await LogRoute.getAll(date);  // Обновляем записи раздела Журнал действий пользователя

        // Записываем текущий диапазон даты в хранилище
        store.dispatch(ActionCreator.ActionCreatorLog.setDateLog(date));
    }

    get title() {
        return "Журнал действий пользователей";
    }

    get header() {
        return headerLog;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v"];

        // Инициализируем заголовок таблицы
        const headers = {
            date: "Дата и время",
            action: "Действие",
            username: "Имя пользователя",
            content: "Содержание записи"
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
            data: store.getState().reducerLog.logs
        }
    }

    renderRangePicker(date, dateObject) {
        if (dateObject["log"]) {
            date = [
                moment(dateObject["log"].split("/")[0], TabOptions.dateFormat),
                moment(dateObject["log"].split("/")[1], TabOptions.dateFormat)
            ];
        }

        return (
            <RangePickerComponent
                onChange={this.onChangeRangePicker}
                date={date}
            />
        )
    }

    renderAddButton() {
        return null;
    }

    renderDeleteByPeriodButton(specKey, short, getContent, visiblePopConfirm, setLoadingDelete, setVisiblePopConfirm, loadingDelete, user) {
        return user && checkRoleUser(specKey, user).edit
            ? <Popconfirm
                title="Удалить всё за выбранный период?"
                okText="Удалить"
                visible={visiblePopConfirm}
                onConfirm={async () => await LogRoute.deleteByPeriod(setLoadingDelete, setVisiblePopConfirm)}
                onCancel={() => setVisiblePopConfirm(false)}
                okButtonProps={{loading: loadingDelete}}
                icon={<QuestionCircleOutlined style={{color: "red"}}/>}
            >
                <Button
                    className={`button ${short}`}
                    type="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => setVisiblePopConfirm(true)}
                >
                    {getContent("Удалить")}
                </Button>
            </Popconfirm>
            : null
    }

    render() {
        const options = {
            createTitle: "Просмотр записи",
            editTitle: "Просмотр записи",
            tab: LogTab,
            tabKey: "logItem",
            modelRoute: LogRoute
        };

        return super.render(options);
    }
}