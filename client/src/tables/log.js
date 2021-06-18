// Класс таблицы раздела "Журнал действий пользователей"
import moment from "moment";

import TableConstructor from "./init";
import {LogTab} from "../tabs/log";
import {LogRoute} from "../routes/route.Log";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import TabOptions from "../options/tab.options/record.options";

export default class LogTable extends TableConstructor {
    async onChangeRangePicker(value, dateString) {
        const date = dateString[0] + "/" + dateString[1];

        await LogRoute.getAll(date);  // Обновляем записи раздела Журнал действий пользователя

        // Записываем текущий диапазон даты в хранилище
        store.dispatch(ActionCreator.ActionCreatorLog.setDateLog(date));
    }

    renderRangePicker(date, dateObject) {
        if (dateObject["log"]) {
            date = [
                moment(dateObject["log"].split("/")[0], TabOptions.dateFormat),
                moment(dateObject["log"].split("/")[1], TabOptions.dateFormat)
            ];
        }

        return super.renderRangePicker(date, this.onChangeRangePicker);
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