// Класс таблицы
import React from "react";
import {Row, Col, Button, Table, message} from "antd";
import {FileExcelOutlined, PlusOutlined} from "@ant-design/icons";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

import tableSettings from "../options/tab.options/table.options/settings";
import {filterTable} from "../helpers/functions/general.functions/filterTable";
import openRecord from "../helpers/functions/tabs.functions/openRecordTab";
import {openRecordTab} from "../helpers/mappers/tabs.mappers/table.helper";
import {checkRoleUser} from "../helpers/mappers/general.mappers/checkRoleUser";

export default class BaseTable {
    constructor({data, columns, columnsOptions, pageSize = 10, filterText, loading, className, sectionName}) {
        this._data = data;
        this._columns = columns;
        this.columnsOptions = columnsOptions;
        this.pageSize = pageSize;
        this.filterText = filterText;
        this.loading = loading;
        this.className = className;
        this.sectionName = sectionName;
    }

    get data() {
        return this._data;
    }

    get columns() {
        return this._columns;
    }

    filterData() {
        return this._columns && this._columns.length ? filterTable(this._data, this.filterText) : null;
    }

    async onRowClick({row, createTitle, editTitle, tab, tabKey, modelRoute}) {
        await openRecord(row._id, createTitle, editTitle, tab, tabKey, modelRoute);
    }

    renderAddButton(short, getContent, user) {
        return user && checkRoleUser(this.sectionName, user).edit
            ? <Button
                className={`button ${short}`}
                icon={<PlusOutlined/>}
                type="primary"
                onClick={() => openRecordTab(this.sectionName, "-1")}
            >
                {getContent("Добавить")}
            </Button>
            : null
    }

    export(fileName, data, headers) {
        if (data && data.length) {
            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";

            // Добавляем хедеры в таблицу
            data.unshift(headers);
            // Преобразовываем данные
            const workSheet = XLSX.utils.json_to_sheet(data, {skipHeader: true});
            // Создаем workbook
            const workBook = {Sheets: {data: workSheet}, SheetNames: ["data"]};
            // Записываем в файл данные
            const excelBuffer = XLSX.write(workBook, {bookType: "xlsx", type: "array"});
            // Создаем blob объект для сохранения
            const exportData = new Blob([excelBuffer], {type: fileType});
            // Сохраняем файл с именем fileName + fileExtension
            FileSaver.saveAs(exportData, fileName + fileExtension);
        } else {
            message.warning("Записи в таблице отсутствуют").then(null);
            return null;
        }
    }

    renderExportButton(short, getContent) {
        return <Button className={`button ${short}`} icon={<FileExcelOutlined/>} onClick={this.export}>
            {getContent("Экспорт")}
        </Button>
    }

    render({
               createTitle, editTitle, tab, tabKey = null, modelRoute = null,
               defaultExpandAllRows = false, expandedRowKeys = [], onExpand = () => null
           } = {},
           goToLogDO = false
    ) {
        return (
            <Row>
                <Col span={24}>
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
                        onRow={row => ({
                            onClick: () => this.onRowClick({
                                row,
                                createTitle,
                                editTitle,
                                tab,
                                tabKey,
                                modelRoute
                            })
                        })}
                    />
                </Col>
            </Row>
        )
    }
}