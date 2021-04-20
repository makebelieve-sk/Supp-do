import React, {useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {Button, Menu, Dropdown, Checkbox, Skeleton} from "antd";
import {PlusOutlined, FileExcelOutlined, EditOutlined} from "@ant-design/icons";

import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";
import {getColumns, getTableHeader, openRecordTab} from "../../../helpers/mappers/tabs.mappers/table.helper";
import {UserRoute} from "../../../routes/route.User";
import PrintButton from "./printButton";

import "./tableButtons.css";

export const ButtonsComponent = ({specKey, onExport, setColumnsTable}) => {
    const currentUser = useSelector(state => state.reducerAuth.user);  // Получение объекта пользователя

    // Создание состояний для начальных колонок, для отображения выпадающего меню
    const [checkedColumns, setCheckedColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleButton, setVisibleButton] = useState(<Skeleton.Button active />);

    // Получение колонок и шапки таблицы, проверка роли пользователя
    const columns = useMemo(() => getColumns(specKey), [specKey]);
    const headers = useMemo(() => getTableHeader(specKey), [specKey]);
    useMemo(async () => {
        if (currentUser) {
            // Обновляем данные о пользователе
            const user = await UserRoute.getCurrentUser(currentUser._id);

            if (user) {
                const data = checkRoleUser(specKey, user);

                data.edit
                    ? setVisibleButton(<Button
                        className="button"
                        icon={<PlusOutlined/>}
                        type="primary"
                        onClick={() => openRecordTab(specKey, "-1")}
                    >
                        Добавить
                    </Button>)
                    : setVisibleButton(null);
            }
        }
    }, [specKey, currentUser]);

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

        return (
            <div style={{display: "flex", justifyContent: "space-between"}}>
                {visibleButton}

                <Button className="button" icon={<FileExcelOutlined/>}
                        onClick={e => onExport(e.target.value)}>Экспорт</Button>

                <PrintButton headers={headers} specKey={specKey}/>

                <Dropdown overlay={dropdownMenu} onVisibleChange={handleVisibleChange} visible={visible}>
                    <Button className="button" icon={<EditOutlined/>}>Колонки</Button>
                </Dropdown>
            </div>
        );
    }, [specKey, onExport, visible, columns, checkedColumns, setCheckedColumns, setColumnsTable, headers, visibleButton]);
};