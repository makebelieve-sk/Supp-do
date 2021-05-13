// Компонент, возвращающий кнопку печати таблиц
import React from "react";
import ReactToPrint from "react-to-print";
import {Button, message} from "antd";
import {PrinterOutlined} from "@ant-design/icons";

import PrintTable from "../../../options/tab.options/table.options/print-table";
import {getPrintTable} from "../../../helpers/mappers/tabs.mappers/table.helper";

import "./tableButtons.css";

export default class PrintButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            data: null,
            display: "none"
        };
    };

    render() {
        return (
            <div>
                <ReactToPrint
                    documentTitle={this.state.name}
                    trigger={() =>
                        <Button className={`button ${this.props.short}`} icon={<PrinterOutlined/>}>
                            {this.props.getContent("Печать")}
                        </Button>
                    }
                    content={() => this.tableRef}
                    onBeforePrint={() => {
                        setTimeout(() => this.setState({display: "block"}), 500);

                        return Promise.resolve();
                    }}
                    onAfterPrint={() => {
                        this.setState({display: "none"});

                        return Promise.resolve();
                    }}
                    onBeforeGetContent={() => {
                        const {name, getData} = getPrintTable(this.props.specKey);

                        let data = getData();
                        let result = [];

                        if (data && data.length) {
                            data.forEach(printObj => {
                                if (printObj.nameWithParent) {
                                    const assign = Object.assign({}, printObj);

                                    assign.name = assign.nameWithParent;
                                    delete assign.nameWithParent;

                                    result.push(assign);
                                } else if (printObj.satisfies) {
                                    const assign = Object.assign({}, printObj);

                                    delete assign.satisfies;

                                    result.push(assign);
                                } else if (printObj.permissions) {
                                    const assign = Object.assign({}, printObj);

                                    delete assign.permissions;

                                    result.push(assign);
                                } else if (printObj.name && printObj.name.label) {
                                    result.push({
                                        ...printObj,
                                        name: printObj.name.label
                                    });
                                } else {
                                    result.push(printObj);
                                }
                            })
                        }

                        // Обновляем состояние данных таблицы
                        this.setState({name, data: result});

                        // Если записей в таблице нет, то не начинаем печатать
                        if (getData() && getData().length) {
                            return Promise.resolve();
                        } else {
                            message.warning("Записи в таблице отсутствуют").then(null);
                            return Promise.reject();
                        }
                    }}
                />

                <div style={{position: "absolute", display: this.state.display, opacity: 0}}>
                    <PrintTable
                        ref={el => this.tableRef = el}
                        headers={this.props.headers}
                        data={this.state.data}
                        name={this.state.name}
                    />
                </div>
            </div>
        )
    }
}