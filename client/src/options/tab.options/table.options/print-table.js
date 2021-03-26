// Компонент, строющий таблицу раздела для печати
import React from "react";

import {getPrintFilteredData} from "../../global.options/global.options";
import {CheckOutlined} from "@ant-design/icons";

export default class PrintTable extends React.Component {
    render() {
        const {headers, data, name} = this.props;

        // Шапка таблицы
        const headersTable = headers ? headers.split(", ") : null;

        return (
            <div style={{padding: 15}}>
                <h3 style={{textAlign: "center"}}>{name}</h3>

                <table style={{fontSize: 10, width: "100%"}}>
                    <thead>
                        <tr>
                            {headersTable.map((header, index) =>
                                <th key={`${header}-${index}`} style={{textAlign: "center"}}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.length ?
                                data.map((record, index) => {
                                    // Получаем массив ключей записи
                                    const cellsArray = Object.keys(record);

                                    // Фильтруем нужные для печати поля
                                    const filteredDataKeys = getPrintFilteredData(cellsArray);
                                    // console.log(filteredDataKeys)

                                    return <tr key={`${record}-${index}`}>
                                        {filteredDataKeys.map(key => {
                                            if (typeof record[key] === "boolean") {
                                                record[key] = record[key] ? <CheckOutlined/> : "";
                                            }

                                            return <td key={`${key}`} style={{textAlign: "center", padding: 0, margin: 0}}>
                                                {record[key]}
                                            </td>
                                        })}
                                    </tr>
                                })
                                : <tr><td style={{textAlign: "center"}}>{"Нет данных"}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}