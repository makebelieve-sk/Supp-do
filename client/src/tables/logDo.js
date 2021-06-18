// Класс таблицы раздела "Журнал дефектов и отказов"
import {message} from "antd";
import moment from "moment";

import TableConstructor from "./init";
import {LogDOTab} from "../tabs/logDo";
import {LogDORoute} from "../routes/route.LogDO";
import store from "../redux/store";
import {headerLogDO} from "../options/tab.options/table.options/exportHeaders";
import tableSettings from "../options/tab.options/table.options/settings";
import {ActionCreator} from "../redux/combineActions";
import TabOptions from "../options/tab.options/record.options";

export default class LogDOTable extends TableConstructor {
    constructor(props) {
        super(props);

        this.className = "table-logDo";

        this.export = this.export.bind(this);
    }

    get title() {
        return "Журнал дефектов и отказов";
    }

    get header() {
        return headerLogDO;
    }

    export() {
        return this.data && this.data.length
            ? tableSettings.export(this)
            : message.warning("Записи в таблице отсутствуют");
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

        return super.renderRangePicker(date, this.onChangeRangePicker);
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