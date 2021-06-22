// Класс таблицы раздела "Пользователи"
import BaseTable from "./BaseTable";
import {UserTab} from "../tabs/user";
import {UserRoute} from "../routes/route.User";
import {headerUser} from "../options/tab.options/table.options/exportHeaders";
import store from "../redux/store";

export default class UserTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Пользователи";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerUser;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v"];

        // Инициализируем заголовок таблицы
        const headers = {
            userName: "Имя пользователя",
            firstName: "Имя",
            secondName: "Фамилия",
            roles: "Роли",
            email: "Электронная почта",
            approved: "Одобрен"
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

            obj["approved"] = obj["approved"] ? "Да" : "Нет";
        });

        super.export(this.title, copyData, headers);
    }

    print() {
        return {
            name: this.title,
            data: store.getState().reducerUser.users
        }
    }

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