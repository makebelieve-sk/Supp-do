// Компонент, возвращающий кнопку печати таблиц или печати раздела "Аналитика"
import React from "react";
import ReactToPrint from "react-to-print";
import {Button, message} from "antd";
import {PrinterOutlined} from "@ant-design/icons";

import PrintTable from "../../../options/tab.options/table.options/printTable";
import PrintAnalytic from "../../../tabs/analytic/printAnalytic";
import store from "../../../redux/store";

import "./tableButtons.css";

export default class PrintButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            data: null,
            display: "none"
        };

        // Биндим контекст функций
        this.onBeforeGetContent = this.onBeforeGetContent.bind(this);
        this.getContent = this.getContent.bind(this);
    };

    componentDidMount() {
        const {specKey} = this.props;

        if (specKey === "analytic") {
            const name = "Аналитика";
            const data = store.getState().reducerAnalytic.analytic;

            // Обновляем состояние данных таблицы
            this.setState({name, data});
        }
    }

    // Возвращаем ссылку на элемент для печати
    getContent() {
        return this.props.specKey === "analytic" ? this.analyticRef : this.tableRef;
    }

    // Формируем контент для печати
    onBeforeGetContent() {
        const {specKey, table} = this.props;

        let name, data;

        if (specKey !== "analytic") {
            name = table.print().name;
            data = table.print().data;

            let result = null;

            if (data && data.length) {
                result = [];

                data.forEach(printObj => {
                    if (printObj.during) {
                        const assign = Object.assign({}, printObj);

                        if (table.transformDuring) {
                            assign.during = table.transformDuring(assign.during);
                        }

                        result.push(assign);
                    } else if (printObj.textParser) {
                        const assign = Object.assign({}, printObj);

                        delete assign.textParser;

                        result.push(assign);
                    } else if (printObj.nameWithParent) {
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

                // Обновляем состояние данных таблицы
                this.setState({name, data: result});
            }
        }

        // Если записей в таблице нет, то не начинаем печатать
        if ((specKey === "analytic" && this.state.data) || (specKey !== "analytic" && data && data.length)) {
            return Promise.resolve();
        } else {
            message.warning("Записи в таблице отсутствуют").then(null);
            return Promise.reject();
        }
    }

    render() {
        const {specKey, getContent, short, table} = this.props;
        const {name, display, data} = this.state;

        let btnStyle = "not-right-margin", headers, style = {};

        if (specKey !== "analytic") {
            btnStyle = "";
            headers = table.header;
            style = table.style ?? table.style;
        }

        return (
            <div>
                <ReactToPrint
                    documentTitle={name}
                    trigger={() =>
                        <Button className={`button ${short} ${btnStyle}`} icon={<PrinterOutlined/>}>
                            {getContent("Печать")}
                        </Button>
                    }
                    content={this.getContent}
                    onBeforePrint={() => {
                        setTimeout(() => this.setState({display: "block"}), 500);

                        return Promise.resolve();
                    }}
                    onAfterPrint={() => {
                        this.setState({display: "none"});

                        return Promise.resolve();
                    }}
                    onBeforeGetContent={this.onBeforeGetContent}
                    pageStyle="@media print and (orientation: landscape) { .bar-char-border { border-bottom: 1px solid grey } .row-2 { page-break-before: always; } .row-3 { page-break-before: always; } }}"
                />

                <div style={{position: "absolute", display: display, opacity: 0}}>
                    {
                        specKey === "analytic"
                            ? <PrintAnalytic ref={el => this.analyticRef = el} data={data} name={name} />
                            : <PrintTable
                                ref={el => this.tableRef = el}
                                style={style}
                                headers={headers}
                                data={data}
                                name={name}
                            />
                    }
                </div>
            </div>
        )
    }
}