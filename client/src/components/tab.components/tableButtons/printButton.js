// Компонент, возвращающий кнопку печати
import React from "react";
import ReactToPrint from "react-to-print";
import {Button} from "antd";
import {PrinterOutlined} from "@ant-design/icons";

import PrintTable from "../../../options/tab.options/table.options/print-table";
import {getPrintTable} from "../../../helpers/mappers/tabs.mappers/table.helper";

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
                    trigger={() => <Button className="button-style" icon={<PrinterOutlined/>} size="middle">Печать</Button>}
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

                        // Обновляем состояние данных таблицы
                        this.setState({name, data: getData()});

                        return Promise.resolve();
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