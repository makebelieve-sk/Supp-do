// Класс таблицы раздела "Профессии"
import TableConstructor from "./init";
import {ProfessionTab} from "../tabs/profession";
import {ProfessionRoute} from "../routes/route.profession";

export default class ProfessionTable extends TableConstructor {
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