// Класс таблицы раздела "Статистика/Перечень незакрытых заявок"
import moment from "moment";
import React from "react";

import LogDOTable from "./LogDoTable";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {StatisticListRoute} from "../routes/route.StatisticList";
import TabOptions from "../options/tab.options/record.options";
import {RangePickerComponent} from "../components/tab.components/rangePicker";
import {headerStatisticList} from "../options/tab.options/table.options/exportHeaders";
import BaseTable from "./BaseTable";

export default class StatisticListTable extends LogDOTable {
    constructor(props) {
        super(props);

        this.className = "table-usual";
        this.export = this.export.bind(this);
    }

    get title() {
        return "Перечень незакрытых заявок";
    }

    get header() {
        return headerStatisticList;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "color", "equipmentTooltip"];

        // Инициализируем заголовок таблицы
        const headers = {
            equipment: "Оборудование",
            notes: "Описание",
            applicant: "Исполнитель",
            taskStatus: "Состояние",
            during: "Продолжительноть, дд:чч:мм"
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

            let days = Math.floor(obj.during / 86400);
            let hours = Math.floor((obj.during - (days * 86400)) / 3600);
            let minutes = Math.floor((obj.during - (days * 86400) - (hours * 3600)) / 60);

            if (days < 10) days = "0" + days;
            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;

            obj["during"] = days + ":" + hours + ":" + minutes;
        });

        BaseTable.prototype.export.apply(this, [this.title, copyData, headers]);
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerStatistic.statisticList
        }
    }

    transformDuring(during) {
        let days = Math.floor(during / 86400);
        let hours = Math.floor((during - (days * 86400)) / 3600);
        let minutes = Math.floor((during - (days * 86400) - (hours * 3600)) / 60);

        if (days < 10) days = "0" + days;
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;

        return days + ":" + hours + ":" + minutes;
    }

    async onChangeRangePicker(value, dateString) {
        const date = dateString[0] + "/" + dateString[1];

        await StatisticListRoute.getAll(date);  // Обновляем записи раздела Статистика

        // Записываем текущий диапазон даты в хранилище
        store.dispatch(ActionCreator.ActionCreatorStatistic.setDateList(date));
    }

    renderRangePicker(date, dateObject) {
        if (dateObject["list"]) {
            date = [
                moment(dateObject["list"].split("/")[0], TabOptions.dateFormat),
                moment(dateObject["list"].split("/")[1], TabOptions.dateFormat)
            ];
        }

        return (
            <RangePickerComponent
                onChange={this.onChangeRangePicker}
                date={date}
            />
        )
    }
}