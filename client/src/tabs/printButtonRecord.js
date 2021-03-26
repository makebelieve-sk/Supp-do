// Компонент, возвращающий кнопку печати таблиц
import React from "react";
import ReactToPrint from "react-to-print";
import {Button} from "antd";
import {PrinterOutlined} from "@ant-design/icons";

import PrintEquipment from "./equipment/equipment.print";
import {getPrintRecord} from "../helpers/mappers/tabs.mappers/printRecord";
import PrintLogDO from "./logDo/logDO.print";

export default class PrintButtonRecord extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            record: null,
            display: "none"
        };
    };

    render() {
        return (
            <div>
                <ReactToPrint
                    documentTitle={this.state.name}
                    trigger={() => <Button className="button-style" type="secondary" icon={<PrinterOutlined/>}>Печать</Button>}
                    content={() => this.recordRef}
                    onBeforePrint={() => {
                        setTimeout(() => this.setState({display: "block"}), 500);

                        return Promise.resolve();
                    }}
                    onAfterPrint={() => {
                        this.setState({display: "none"});

                        return Promise.resolve();
                    }}
                    onBeforeGetContent={() => {
                        const {name, getRecord} = getPrintRecord(this.props.specKey);

                        // Обновляем состояние данных таблицы
                        this.setState({name, record: getRecord()});

                        return Promise.resolve();
                    }}
                />

                <div style={{position: "absolute", display: this.state.display, opacity: 0}}>
                    {
                        this.props.specKey === "equipmentItem"
                            ? <PrintEquipment ref={el => this.recordRef = el} record={this.state.record}/>
                            : <PrintLogDO ref={el => this.recordRef = el} record={this.state.record}/>
                    }
                </div>
            </div>
        )
    }
}