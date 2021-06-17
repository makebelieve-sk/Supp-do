// Класс таблицы раздела "Помощь"
import TableConstructor from "./init";
import {HelpTab} from "../tabs/help";
import {HelpRoute} from "../routes/route.Help";

export default class HelpTable extends TableConstructor {
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