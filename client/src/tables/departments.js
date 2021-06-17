// Класс таблицы раздела "Подразделения"
import TableConstructor from "./init";
import {DepartmentTab} from "../tabs/department";
import {DepartmentRoute} from "../routes/route.Department";
import {filterTreeTable} from "../helpers/functions/general.functions/filterTable";
import {createTreeData} from "../helpers/functions/general.functions/createTreeData.helper";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";

export default class DepartmentTable extends TableConstructor {
    constructor(props) {
        super(props);

        this.data = createTreeData(props.data);
    }

    filterData() {
        return this.columns && this.columns.length ? filterTreeTable(this.data, this.filterText) : null;
    }

    onExpandHandler(expanded, record, expandRows) {
        if (expanded) {
            store.dispatch(ActionCreator.ActionCreatorDepartment.setExpandRowsDepartment([
                ...expandRows,
                record._id
            ]));
        } else {
            const indexOf = expandRows.indexOf(record._id);

            if (indexOf >= 0) {
                store.dispatch(ActionCreator.ActionCreatorDepartment.setExpandRowsDepartment([
                    ...expandRows.slice(0, indexOf),
                    ...expandRows.slice(indexOf + 1),
                ]));
            }
        }
    };

    render(equipmentOptions = null) {
        const options = {
            createTitle: "Создание подразделения",
            editTitle: "Редактирование подразделения",
            tab: DepartmentTab,
            tabKey: "departmentItem",
            modelRoute: DepartmentRoute,
            defaultExpandAllRows: true,
            expandedRowKeys: store.getState().reducerDepartment.expandRowsDepartment,
            onExpand: this.onExpandHandler
        };

        return super.render(equipmentOptions ? equipmentOptions : options);
    }
}