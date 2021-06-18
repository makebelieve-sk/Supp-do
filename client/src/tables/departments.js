// Класс таблицы раздела "Подразделения"
import {message} from "antd";

import TableConstructor from "./init";
import {DepartmentTab} from "../tabs/department";
import {DepartmentRoute} from "../routes/route.Department";
import {filterTreeTable} from "../helpers/functions/general.functions/filterTable";
import {createTreeData} from "../helpers/functions/general.functions/createTreeData.helper";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {headerDepartment} from "../options/tab.options/table.options/exportHeaders";
import tableSettings from "../options/tab.options/table.options/settings";

export default class DepartmentTable extends TableConstructor {
    constructor(props) {
        super(props);

        this._initialData = props.data;
        this._data = createTreeData(props.data);

        this.export = this.export.bind(this);
    }

    filterData() {
        return this.columns && this.columns.length ? filterTreeTable(this._data, this.filterText) : null;
    }

    get title() {
        return "Подразделения";
    }

    get style() {
        return "left";
    }

    get header() {
        return headerDepartment;
    }

    // Перваначальные данные раздела (не преобразованные)
    get initialData() {
        return this._initialData;
    }

    export() {
        return this.initialData && this.initialData.length
            ? tableSettings.export(this)
            : message.warning("Записи в таблице отсутствуют");
    }

    print() {
        return {
            name: this.title,
            data: this.initialData
        }
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
    }

    expandAll(expand) {
        const expandResult = !expand && this.initialData && this.initialData.length
            ? this.initialData.map(object => object._id)
            : [];

        store.dispatch(ActionCreator.ActionCreatorDepartment.setExpandRowsDepartment(expandResult));
    }

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