// Печать таблицы раздела
import React from "react";
import {CheckOutlined} from "@ant-design/icons";

import filterTableKeys from "../filterTableKeys";

import "./printTable.css";

export default class PrintTable extends React.Component {
    render() {
        const {headers, data, name, style} = this.props;

        // Получаем массив ключей записи и фильтруем нужные для печати поля
        const keys = Object.keys(data && data.length ? data[0] : {});
        const filteredDataKeys = filterTableKeys(keys);

        return (
            <div className="print-wrapper">
                <h3 className="print-title">{name}</h3>

                <table className="print-table">
                    <thead>
                        <tr>
                            {
                                headers && headers.map((header, index) =>
                                    <th key={`${header}-${index}`} className="print-table-header">
                                        {header}
                                    </th>
                                )
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            data && data.length
                                ? data.map((record, index) => {
                                    return <tr key={`${record}-${index}`}>
                                        {
                                            filteredDataKeys.map(key => {
                                                if (typeof record[key] === "boolean") {
                                                    record[key] = record[key] ? <CheckOutlined/> : "";
                                                }

                                                if (key === "parent") {
                                                    record[key] = record[key] && record[key].name ? record[key].name : "";
                                                }

                                                return <td key={`${key}`} className={`print-table-cell ${style}`}>
                                                    {record[key]}
                                                </td>
                                            })
                                        }
                                    </tr>
                                })
                                : <tr>
                                    <td className="no-data">Нет данных</td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}