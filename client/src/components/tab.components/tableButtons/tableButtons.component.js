// Компонент, отрисовывающий кнопки таблицы
import React, {useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {Button, Menu, Dropdown, Checkbox} from "antd";
import {PlusOutlined, FileExcelOutlined, EditOutlined} from "@ant-design/icons";

import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";
import {getColumns, getTableHeader, openRecordTab} from "../../../helpers/mappers/tabs.mappers/table.helper";
import PrintButton from "./printButton";
import {useWindowWidth} from "../../../hooks/windowWidth.hook";

import "./tableButtons.css";

export const ButtonsComponent = ({specKey, onExport, setColumnsTable}) => {
    const user = useSelector(state => state.reducerAuth.user);  // Получение объекта пользователя

    const screen = useWindowWidth();    // Получаем текущее значение ширины окна браузера

    // Создание состояний для начальных колонок, для отображения выпадающего меню
    const [checkedColumns, setCheckedColumns] = useState([]);
    const [visible, setVisible] = useState(false);

    // Получение колонок и шапки таблицы, проверка роли пользователя
    const columns = useMemo(() => getColumns(specKey), [specKey]);
    const headers = useMemo(() => getTableHeader(specKey), [specKey]);

    // Функция для изменения стейта отображения выпадающего списка колонок
    const handleVisibleChange = flag => setVisible(flag);

    return useMemo(() => {
        // Функция изменения видимости колонок
        const onChange = (e) => {
            let checkedColumnsTable = checkedColumns;

            if (e.target.checked) {
                checkedColumnsTable = checkedColumnsTable.filter(id => id !== e.target.id);
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
                            <Checkbox id={column.key} onChange={onChange} defaultChecked>
                                {column.title}
                            </Checkbox>
                        </Menu.Item>
                    )
                })}
            </Menu.ItemGroup>
        </Menu>;

        // Получение контента кнопки в зависимости от ширины экрана
        const getContent = (content) => screen !== "xs" && screen !== "sm" && screen !== "md" ? content : null;
        const short = screen === "xs" || screen === "sm" || screen === "md" ? "short" : "";

        return (
            <div className="wrapper_buttons">
                {
                    user && checkRoleUser(specKey, user).edit
                        ? <Button className={`button ${short}`} icon={<PlusOutlined/>} type="primary"
                                  onClick={() => openRecordTab(specKey, "-1")}>
                            {getContent("Добавить")}
                    </Button>
                        : null
                }

                <Button className={`button ${short}`} icon={<FileExcelOutlined/>}
                        onClick={e => onExport(e.target.value)}>{getContent("Экспорт")}</Button>

                <PrintButton headers={headers} specKey={specKey} short={short} getContent={getContent}/>

                <Dropdown overlay={dropdownMenu} onVisibleChange={handleVisibleChange} visible={visible}>
                    <Button className={`button ${short} last_button`} icon={<EditOutlined/>}>{getContent("Колонки")}</Button>
                </Dropdown>
            </div>
        );
    }, [specKey, onExport, visible, columns, checkedColumns, setCheckedColumns, setColumnsTable, headers, user, screen]);
};