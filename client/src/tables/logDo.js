// Класс таблицы раздела "Журнал дефектов и отказов"
import TableConstructor from "./init";
import {LogDOTab} from "../tabs/logDo";
import {LogDORoute} from "../routes/route.LogDO";

export default class LogDOTable extends TableConstructor {
    constructor(props) {
        super(props);

        this.className = "table-logDo";
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