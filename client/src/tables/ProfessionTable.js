// Класс таблицы раздела "Профессии"
import BaseTable from "./BaseTable";
import {ProfessionTab} from "../tabs/profession";
import {ProfessionRoute} from "../routes/route.profession";
import store from "../redux/store";
import {headerProfession} from "../options/tab.options/table.options/exportHeaders";

export default class ProfessionTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Профессии";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerProfession;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v"];

        // Инициализируем заголовок таблицы
        const headers = {
            name: "Наименование",
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
            data: store.getState().reducerProfession.professions
        }
    }

    render() {
        const options = {
            createTitle: "Создание профессии",
            editTitle: "Редактирование профессии",
            tab: ProfessionTab,
            tabKey: "professionItem",
            modelRoute: ProfessionRoute
        };

        return super.render(options);
    }
}