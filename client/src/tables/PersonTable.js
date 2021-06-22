// Класс таблицы раздела "Персонал"
import BaseTable from "./BaseTable";
import {PersonTab} from "../tabs/person";
import {PersonRoute} from "../routes/route.Person";
import {headerPerson} from "../options/tab.options/table.options/exportHeaders";
import store from "../redux/store";

export default class PersonTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Персонал";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerPerson;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "departmentTooltip"];

        // Инициализируем заголовок таблицы
        const headers = {
            name: "ФИО",
            department: "Подразделение",
            profession: "Профессия",
            notes: "Примечание"
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
        });

        super.export(this.title, copyData, headers);
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerPerson.people
        }
    }

    render() {
        const options = {
            createTitle: "Создание записи о сотруднике",
            editTitle: "Редактирование записи о сотруднике",
            tab: PersonTab,
            tabKey: "personItem",
            modelRoute: PersonRoute
        };

        return super.render(options);
    }
}