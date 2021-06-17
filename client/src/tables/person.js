// Класс таблицы раздела "Персонал"
import TableConstructor from "./init";
import {PersonTab} from "../tabs/person";
import {PersonRoute} from "../routes/route.Person";

export default class PersonTable extends TableConstructor {
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