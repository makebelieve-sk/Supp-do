// Класс таблицы раздела "Помощь"
import BaseTable from "./BaseTable";
import {HelpTab} from "../tabs/help";
import {HelpRoute} from "../routes/route.Help";
import {headerHelp} from "../options/tab.options/table.options/exportHeaders";
import store from "../redux/store";
import {request} from "../helpers/functions/general.functions/request.helper";

export default class HelpTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Помощь";
    }

    get header() {
        return headerHelp;
    }

    async export() {
        try {
            const data = await request("/api/admin/help/");

            if (data && data.length) {
                // Создаем массив ненужных для экспорта ключей
                const unUsedKeys = ["_id", "__v"];

                // Инициализируем заголовок таблицы
                const headers = {
                    name: "Название раздела",
                    text: "Текст",
                    date: "Дата изменения"
                };

                // Создаем копию данных
                const copyData = [];

                if (data && data.length) {
                    data.forEach(obj => {
                        const copyObject = Object.assign({}, obj);
                        copyData.push(copyObject);
                    });
                }

                copyData.forEach(obj => {
                    unUsedKeys.forEach(key => {
                        delete obj[key];
                    });

                    const div = document.createElement("div");
                    div.innerHTML = obj["text"];
                    obj["text"] = div.textContent || div.innerHTML || "";
                    obj["text"] = obj["text"].replaceAll("\n", "");
                });

                super.export(this.title, copyData, headers);
            }
        } catch (e) {
            console.log(e);
            throw new Error(e.message);
        }
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerHelp.help
        }
    }

    render() {
        const options = {
            createTitle: "Создание записи помощи",
            editTitle: "Редактирование записи помощи",
            tab: HelpTab,
            tabKey: "helpItem",
            modelRoute: HelpRoute
        };

        return super.render(options);
    }
}