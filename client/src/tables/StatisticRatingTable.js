// Класс таблицы раздела "Статистика/Рейтинг отказов"
import moment from "moment";
import React from "react";

import BaseTable from "./BaseTable";
import store from "../redux/store";
import {goToLogDO} from "../tabs/analytic";
import {ActionCreator} from "../redux/combineActions";
import {StatisticRatingRoute} from "../routes/route.StatisticRating";
import TabOptions from "../options/tab.options/record.options";
import {RangePickerComponent} from "../components/tab.components/rangePicker";
import {headerStatisticRating} from "../options/tab.options/table.options/exportHeaders";

export default class StatisticRatingTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Рейтинг отказов";
    }

    get header() {
        return headerStatisticRating;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "equipmentTooltip", "satisfies"];

        // Инициализируем заголовок таблицы
        const headers = {
            equipment: "Оборудование",
            notAssigned: "Не назначенные заявки",
            inWork: "Заявки в работе",
            done: "Выполненные заявки",
            accept: "Принятые заявки",
            failure: "Количество отказов, шт",
            during: "Общая продолжительноть простоев, чч:мм"
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

            let hours = Math.floor(obj.during / 3600);
            let minutes = Math.floor((obj.during - (hours * 3600)) / 60);

            if (hours < 10) hours = "0" + hours;
            if (minutes < 10) minutes = "0" + minutes;

            obj["during"] = hours + ":" + minutes;
        });

        super.export(this.title, copyData, headers);
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerStatistic.statisticRating
        }
    }

    transformDuring(during) {
        let hours = Math.floor(during / 3600);
        let minutes = Math.floor((during - (hours * 3600)) / 60);

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;

        return hours + ":" + minutes;
    }

    async onRowClick({row}) {
        await goToLogDO("/rating", {
            satisfies: row.satisfies,
            equipment: row.equipment,
            date: store.getState().reducerStatistic.dateRating
        })
    }

    async onChangeRangePicker(value, dateString) {
        const date = dateString[0] + "/" + dateString[1];

        await StatisticRatingRoute.getAll(date);  // Обновляем записи раздела Статистика

        // Записываем текущий диапазон даты в хранилище
        store.dispatch(ActionCreator.ActionCreatorStatistic.setDateRating(date));
    }

    renderRangePicker(date, dateObject) {
        if (dateObject["rating"]) {
            date = [
                moment(dateObject["rating"].split("/")[0], TabOptions.dateFormat),
                moment(dateObject["rating"].split("/")[1], TabOptions.dateFormat)
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