// Класс таблицы раздела "Подразделения"
import React from "react";
import {Button} from "antd";
import {ExpandAltOutlined, ShrinkOutlined} from "@ant-design/icons";

import BaseTable from "./BaseTable";
import {DepartmentTab} from "../tabs/department";
import {DepartmentRoute} from "../routes/route.Department";
import {filterTreeTable} from "../helpers/functions/general.functions/filterTable";
import {createTreeData} from "../helpers/functions/general.functions/createTreeData.helper";
import store from "../redux/store";
import {ActionCreator} from "../redux/combineActions";
import {headerDepartment} from "../options/tab.options/table.options/exportHeaders";

export default class DepartmentTable extends BaseTable {
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
        // Создаем массив ненужных для экспорта ключей
        const unUsedKeys = ["_id", "__v", "parent"];

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

    renderExpandButton(short, expand, setExpand, getContent) {
        return <Button
            className={`button ${short}`}
            icon={expand ? <ExpandAltOutlined /> : <ShrinkOutlined />}
            type="secondary"
            onClick={() => {
                this.expandAll(expand);

                setExpand(!expand);
            }}
        >
            {getContent(expand ? "Свернуть" : "Развернуть")}
        </Button>
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