// Класс таблицы раздела "Журнал действий пользователей"
import TableConstructor from "./init";
import {LogTab} from "../tabs/log";
import {LogRoute} from "../routes/route.Log";

export default class LogTable extends TableConstructor {
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