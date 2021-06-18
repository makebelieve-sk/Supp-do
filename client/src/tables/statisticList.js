// Класс таблицы раздела "Статистика/Перечень незакрытых заявок"
import moment from "moment";

import LogDOTable from "./logDo";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {StatisticListRoute} from "../routes/route.StatisticList";
import TabOptions from "../options/tab.options/record.options";
import TableConstructor from "./init";

export default class StatisticListTable extends LogDOTable {
    constructor(props) {
        super(props);

        this.className = "table-usual";
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

        return TableConstructor.prototype.renderRangePicker.apply(this, [date, this.onChangeRangePicker]);
    }
}