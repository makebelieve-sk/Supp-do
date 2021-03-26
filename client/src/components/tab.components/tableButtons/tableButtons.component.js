import React, {useState, useMemo} from "react";
import {Button, Row, Menu, Dropdown, Checkbox} from "antd";
import {PlusOutlined, FileExcelOutlined, EditOutlined} from "@ant-design/icons";

import {getColumns, getTableHeader, openRecordTab} from "../../../helpers/mappers/tabs.mappers/table.helper";
import PrintButton from "./printButton";

import "./tabsButtons.css";

export const ButtonsComponent = ({specKey, onExport, setColumnsTable}) => {
    // Получение колонок и шапки таблицы
    const columns = useMemo(() => getColumns(specKey), [specKey]);
    const headers = useMemo(() => getTableHeader(specKey), [specKey]);

    // Создание состояния для начальных колонок и для отображения выпадающего меню
    const [checkedColumns, setCheckedColumns] = useState([]);
    const [visible, setVisible] = useState(false);

    // Функция для изменения стейта отображения выпадающего списка колонок
    const handleVisibleChange = flag => setVisible(flag);

    return useMemo(() => {
        // Функция изменения видимости колонок
        const onChange = (e) => {
            let checkedColumnsTable = checkedColumns;

            if (e.target.checked) {
                checkedColumnsTable = checkedColumnsTable.filter(id => {
                    return id !== e.target.id;
                });
            } else if (!e.target.checked) {
                if (Array.isArray(e.target.id)) {
                    let arr = ["name"];
                    arr.unshift(e.target.id);
                    checkedColumnsTable.push(arr);
                } else {
                    checkedColumnsTable.push(e.target.id);
                }
            }

            let filtered = columns;

            for (let i = 0; i < checkedColumnsTable.length; i++)
                filtered = filtered.filter(el => {
                    let dataIndex = el.dataIndex;

                    if (Array.isArray(dataIndex)) {
                        dataIndex = dataIndex[0];
                    }
                    return dataIndex !== checkedColumnsTable[i];
                });

            setColumnsTable(filtered)
            setCheckedColumns(checkedColumnsTable);
        }

        // Создание переменной для отображения выпадающего списка для колонок
        const dropdownMenu = <Menu>
            <Menu.ItemGroup title="Колонки">
                {columns.map(column => {
                    return (
                        <Menu.Item key={column.key + "-checkbox"}>
                            <Checkbox
                                id={column.key}
                                onChange={onChange}
                                defaultChecked>{column.title}
                            </Checkbox>
                        </Menu.Item>
                    )
                })}
            </Menu.ItemGroup>
        </Menu>;

        return (
            <Row align="middle">
                <Button className="button-style" icon={<PlusOutlined/>} type="primary"
                        onClick={() => openRecordTab(specKey, "-1")}>Добавить</Button>
                <Button className="button-style" icon={<FileExcelOutlined/>} size="middle"
                        onClick={e => onExport(e.target.value)}>Экспорт</Button>

                <PrintButton headers={headers} specKey={specKey}/>

                <Dropdown overlay={dropdownMenu} onVisibleChange={handleVisibleChange} visible={visible}>
                    <Button className="button-style" icon={<EditOutlined/>} size="middle">Колонки</Button>
                </Dropdown>
            </Row>
        );
    }, [specKey, onExport, visible, columns, checkedColumns, setCheckedColumns, setColumnsTable, headers]);
};