// Компонент, возвращающий кнопку печати таблиц или печати раздела "Аналитика"
import React from "react";
import ReactToPrint from "react-to-print";
import {Button, message} from "antd";
import {PrinterOutlined} from "@ant-design/icons";

import PrintTable from "../../../options/tab.options/table.options/printTable";
import PrintAnalytic from "../../../tabs/analytic/printAnalytic";
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

        // Биндим контекст функций
        this.onBeforeGetContent = this.onBeforeGetContent.bind(this);
        this.getContent = this.getContent.bind(this);
    };

    // Фукнция жизниенного цикла компонента (монтирование компонента)
    componentDidMount() {
        const {specKey} = this.props;

        if (specKey === "analytic") {
            const {name, getData} = getPrintTable(specKey);

            // Обновляем состояние данных таблицы
            this.setState({name, data: getData()});
        }
    }

    // Возвращаем ссылку на элемент для печати
    getContent() {
        return this.props.specKey === "analytic" ? this.analyticRef : this.tableRef;
    }

    // Формируем контент для печати
    onBeforeGetContent() {
        const {specKey} = this.props;

        const {name, getData} = getPrintTable(specKey);

        let data = getData();
        let result = null;

        if (data && data.length && specKey !== "analytic") {
            result = [];
            data.forEach(printObj => {
                if (printObj.textParser) {
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

        // Если записей в таблице нет, то не начинаем печатать
        if ((specKey === "analytic" && this.state.data) || (specKey !== "analytic" && getData() && getData().length)) {
            return Promise.resolve();
        } else {
            message.warning("Записи в таблице отсутствуют").then(null);
            return Promise.reject();
        }
    }

    render() {
        const {specKey, getContent, short, headers} = this.props;
        const {name, display, data} = this.state;

        const btnStyle = specKey === "analytic" ? "not-right-margin" : "";

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
                />

                <div style={{position: "absolute", display: display, opacity: 0}}>
                    {
                        specKey === "analytic"
                            ? <PrintAnalytic ref={el => this.analyticRef = el} data={data} name={name} />
                            : <PrintTable
                                ref={el => this.tableRef = el}
                                specKey={specKey}
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