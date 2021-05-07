// Печать таблицы раздела
import React from "react";

import {getPrintFilteredData} from "../../global.options/global.options";
import {CheckOutlined} from "@ant-design/icons";

export default class PrintTable extends React.Component {
    render() {
        const {headers, data, name} = this.props;

        // Шапка таблицы
        const headersTable = headers ? headers.split(", ") : null;

        return (
            <div style={{padding: 10}}>
                <h3 style={{textAlign: "center"}}>{name}</h3>

                <table style={{fontSize: 10, width: "100%"}}>
                    <thead>
                        <tr>
                            {headersTable.map((header, index) =>
                                <th key={`${header}-${index}`} style={{border: "1px solid black", textAlign: "center"}}>
                                    {header}
                                </th>
                            )}
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

                                    return <tr key={`${record}-${index}`}>
                                        {filteredDataKeys.map(key => {
                                            if (typeof record[key] === "boolean") {
                                                record[key] = record[key] ? <CheckOutlined/> : "";
                                            }

                                            return <td key={`${key}`} style={{border: "1px solid black", textAlign: "center", padding: 0, margin: 0}}>
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