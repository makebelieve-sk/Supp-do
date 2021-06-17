// Класс таблицы раздела "Состояние заявки"
import TableConstructor from "./init";
import {TaskTab} from "../tabs/taskStatus";
import {TaskStatusRoute} from "../routes/route.taskStatus";

export default class TaskTable extends TableConstructor {
    render() {
        const options = {
            createTitle: "Создание записи о состоянии заявки",
            editTitle: "Редактирование записи о состоянии заявки",
            tab: TaskTab,
            tabKey: "taskStatusItem",
            modelRoute: TaskStatusRoute
        };

        return super.render(options);
    }
}