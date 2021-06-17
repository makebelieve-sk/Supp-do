// Класс таблицы раздела "Статистика/Перечень незакрытых заявок"
import LogDOTable from "./logDo";

export default class StatisticListTable extends LogDOTable {
    constructor(props) {
        super(props);

        this.className = "table-usual";
    }
}