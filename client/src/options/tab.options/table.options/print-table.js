// Печать таблицы раздела
import React from "react";
import {CheckOutlined} from "@ant-design/icons";

import {getPrintFilteredData} from "../../global.options";

import "./printTable.css";

export default class PrintTable extends React.Component {
    render() {
        const {headers, data, name, specKey} = this.props;

        // Выровнивание текста по левому краю в печатных формах разделов:
        const style = specKey === "professions" || specKey === "departments" || specKey === "person"
            || specKey === "equipmentProperties" || specKey === "equipment"
            ? "left"
            : "";

        // Шапка таблицы
        const headersTable = headers ? headers.split(", ") : null;

        return (
            <div className="print-wrapper">
                <h3 className="print-title">{name}</h3>

                <table className="print-table">
                    <thead>
                        <tr>
                            {headersTable.map((header, index) =>
                                <th key={`${header}-${index}`} className="print-table-header">
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

                                            return <td key={`${key}`} className={`print-table-cell ${style}`}>
                                                {record[key]}
                                            </td>
                                        })}
                                    </tr>
                                })
                                : <tr><td className="no-data">{"Нет данных"}</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}