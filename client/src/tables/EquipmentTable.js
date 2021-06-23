// Класс таблицы раздела "Оборудование"
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import DepartmentTable from "./DepartmentTable";
import {EquipmentTab} from "../tabs/equipment";
import {EquipmentRoute} from "../routes/route.Equipment";
import {headerEquipment} from "../options/tab.options/table.options/exportHeaders";

export default class EquipmentTable extends DepartmentTable {
    constructor(props) {
        super(props);

        this.export = this.export.bind(this);
    }

    get title() {
        return "Оборудование";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerEquipment;
    }

    export() {
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "parent", "properties", "files"];

        // Инициализируем заголовок таблицы
        const headers = {
            name: "Наименование",
            notes: "Примечание",
            nameWithParent: "Принадлежит"
        };

        // Создаем копию данных
        const copyData = [];

        if (this.initialData && this.initialData.length) {
            this.initialData.forEach(obj => {
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

    onExpandHandler(expanded, record, expandRows) {
        if (expanded) {
            store.dispatch(ActionCreator.ActionCreatorEquipment.setExpandRowsEquipment([
                ...expandRows,
                record._id
            ]));
        } else {
            const indexOf = expandRows.indexOf(record._id);

            if (indexOf >= 0) {
                store.dispatch(ActionCreator.ActionCreatorEquipment.setExpandRowsEquipment([
                    ...expandRows.slice(0, indexOf),
                    ...expandRows.slice(indexOf + 1),
                ]));
            }
        }
    }

    expandAll(expand) {
        const expandResult = !expand && this.initialData && this.initialData.length
            ? this.initialData.map(object => object._id)
            : [];

        store.dispatch(ActionCreator.ActionCreatorEquipment.setExpandRowsEquipment(expandResult));
    }

    render() {
        const options = {
            createTitle: "Создание записи об объекте оборудования",
            editTitle: "Редактирование записи об объекте оборудования",
            tab: EquipmentTab,
            tabKey: "equipmentItem",
            modelRoute: EquipmentRoute,
            defaultExpandAllRows: true,
            expandedRowKeys: store.getState().reducerEquipment.expandRowsEquipment,
            onExpand: this.onExpandHandler
        };

        return super.render(options);
    }
}