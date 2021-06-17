// Класс таблицы раздела "Пользователи"
import TableConstructor from "./init";
import {UserTab} from "../tabs/user";
import {UserRoute} from "../routes/route.User";

export default class UserTable extends TableConstructor {
    render() {
        const options = {
            createTitle: "Создание пользователя",
            editTitle: "Редактирование пользователя",
            tab: UserTab,
            tabKey: "userItem",
            modelRoute: UserRoute
        };

        return super.render(options);
    }
}