// Класс таблицы раздела "Роли"
import BaseTable from "./BaseTable";
import {RoleTab} from "../tabs/role";
import {RoleRoute} from "../routes/route.Role";
import {headerRole} from "../options/tab.options/table.options/exportHeaders";
import store from "../redux/store";

export default class RoleTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Роли";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerRole;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "permissions"];

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
            data: store.getState().reducerRole.roles
        }
    }

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