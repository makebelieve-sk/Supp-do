// Класс таблицы раздела "Состояние заявки"
import BaseTable from "./BaseTable";
import {TaskTab} from "../tabs/taskStatus";
import {TaskStatusRoute} from "../routes/route.taskStatus";
import {headerTasks} from "../options/tab.options/table.options/exportHeaders";
import store from "../redux/store";

export default class TaskTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Состояние заявки";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerTasks;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "color"];

        // Инициализируем заголовок таблицы
        const headers = {
            name: "Наименование",
            notes: "Примечание",
            isFinish: "Завершено",
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

            obj["isFinish"] = obj["isFinish"] ? "Да" : "Нет";
        });

        super.export(this.title, copyData, headers);
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerTask.tasks
        }
    }

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