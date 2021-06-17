// Класс таблицы раздела "Профессии"
import TableConstructor from "./init";
import {RoleTab} from "../tabs/role";
import {RoleRoute} from "../routes/route.Role";

export default class RoleTable extends TableConstructor {
    render() {
        const options = {
            createTitle: "Создание роли",
            editTitle: "Редактирование роли",
            tab: RoleTab,
            tabKey: "roleItem",
            modelRoute: RoleRoute
        };

        return super.render(options);
    }
}