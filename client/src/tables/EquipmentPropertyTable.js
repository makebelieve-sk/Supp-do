// Класс таблицы раздела "Характеристики оборудования"
import BaseTable from "./BaseTable";
import {EquipmentPropertyTab} from "../tabs/equipmentProperty";
import {EquipmentPropertyRoute} from "../routes/route.EquipmentProperty";
import {headerEquipmentProperty} from "../options/tab.options/table.options/exportHeaders";
import store from "../redux/store";

export default class EquipmentPropertyTable extends BaseTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Характеристики оборудования";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerEquipmentProperty;
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
            data: store.getState().reducerEquipmentProperty.equipmentProperties
        }
    }

    render() {
        const options = {
            createTitle: "Создание записи о характеристике оборудования",
            editTitle: "Редактирование записи о характеристике оборудования",
            tab: EquipmentPropertyTab,
            tabKey: "equipmentPropertyItem",
            modelRoute: EquipmentPropertyRoute
        };

        return super.render(options);
    }
}