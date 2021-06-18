// Класс таблицы
import React from "react";
import {Table} from "antd";

import tableSettings from "../options/tab.options/table.options/settings";
import {filterTable} from "../helpers/functions/general.functions/filterTable";
import openRecord from "../helpers/functions/tabs.functions/openRecordTab";
import {RangePickerComponent} from "../components/tab.components/rangePicker";

export default class TableConstructor {
    constructor({data, columns, columnsOptions, pageSize = 10, filterText, loading}) {
        this._data = data;
        this.columns = columns;
        this.columnsOptions = columnsOptions;
        this.pageSize = pageSize;
        this.filterText = filterText;
        this.loading = loading;
        this.className = "table-usual";
    }

    get data() {
        return this._data;
    }

    filterData() {
        return this.columns && this.columns.length ? filterTable(this._data, this.filterText) : null;
    }

    async onRowClick({row, createTitle, editTitle, tab, tabKey, modelRoute}) {
        await openRecord(row._id, createTitle, editTitle, tab, tabKey, modelRoute);
    }

    renderRangePicker(date, onChangeRangePicker) {
        return (
            <RangePickerComponent
                onChange={onChangeRangePicker}
                date={date}
            />
        )
    }

    render({createTitle, editTitle, tab, tabKey = null, modelRoute = null, defaultExpandAllRows = false,
               expandedRowKeys = [], onExpand = () => null} = {}, goToLogDO = false) {
        return (
            <Table
                className={this.className}

                rowKey={record => record._id.toString()}
                bordered
                size={tableSettings.size}
                scroll={tableSettings.scroll}
                pagination={{
                    ...tableSettings.pagination,
                    pageSize: this.pageSize
                }}
                expandable={{
                    defaultExpandAllRows,
                    expandedRowKeys,
                    onExpand: (expand, record) => onExpand(expand, record, expandedRowKeys)
                }}

                loading={this.loading}
                dataSource={this.filterData()}
                columns={this.columnsOptions ? this.columnsOptions : this.columns}
                onRow={row => ({onClick: () => this.onRowClick({row, createTitle, editTitle, tab, tabKey, modelRoute})})}
            />
        )
    }
}