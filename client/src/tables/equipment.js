// Класс таблицы раздела "Оборудование"
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import DepartmentTable from "./departments";
import {EquipmentTab} from "../tabs/equipment";
import {EquipmentRoute} from "../routes/route.Equipment";

export default class EquipmentTable extends DepartmentTable {
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
    };

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