// Класс таблицы раздела "Профессии"
import {message} from "antd";

import TableConstructor from "./init";
import {ProfessionTab} from "../tabs/profession";
import {ProfessionRoute} from "../routes/route.profession";
import store from "../redux/store";
import {headerProfession} from "../options/tab.options/table.options/exportHeaders";
import tableSettings from "../options/tab.options/table.options/settings";

export default class ProfessionTable extends TableConstructor {
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
        return this.data && this.data.length
            ? tableSettings.export(this)
            : message.warning("Записи в таблице отсутствуют");
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