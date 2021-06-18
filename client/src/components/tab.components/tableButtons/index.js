// Компонент, отрисовывающий кнопки таблицы
import React, {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {Button, Checkbox, Dropdown, Menu, Popconfirm} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExpandAltOutlined,
    FileExcelOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    ShrinkOutlined
} from "@ant-design/icons";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import {LogRoute} from "../../../routes/route.Log";
import {checkRoleUser} from "../../../helpers/mappers/general.mappers/checkRoleUser";
import {getColumns, openRecordTab} from "../../../helpers/mappers/tabs.mappers/table.helper";
import PrintButton from "./printButton";
import {useWindowWidth} from "../../../hooks/windowWidth.hook";

import "./tableButtons.css";

export const ButtonsComponent = ({specKey, setColumnsTable, table}) => {
    const user = useSelector(state => state.reducerAuth.user);  // Получение объекта пользователя

    const screen = useWindowWidth();    // Получаем текущее значение ширины окна браузера

    // Создание состояний для начальных колонок, для отображения выпадающего меню
    const [checkedColumns, setCheckedColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visiblePopConfirm, setVisiblePopConfirm] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [expand, setExpand] = useState(false);

    // Получение колонок таблицы
    const columns = useMemo(() => getColumns(specKey), [specKey]);

    // Отображение выпадающего меню
    const handleVisibleChange = flag => setVisible(flag);

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

        for (let i = 0; i < checkedColumnsTable.length; i++) {
            filtered = filtered.filter(el => {
                let dataIndex = el.dataIndex;

                if (Array.isArray(dataIndex)) {
                    dataIndex = dataIndex[0];
                }

                return dataIndex !== checkedColumnsTable[i];
            });
        }

        setColumnsTable(filtered);
        setCheckedColumns(checkedColumnsTable);

        // Получаем текущий активный ключ вкладки
        const activeKey = store.getState().reducerTab.activeKey;

        // Обновляем колонки раздела в редаксе
        const columnsOptions = store.getState().reducerMain.columnsOptions;
        columnsOptions[activeKey] = filtered;
        store.dispatch(ActionCreator.ActionCreatorMain.setColumns(columnsOptions));
    }

    // Создание переменной для отображения выпадающего списка для колонок
    const dropdownMenu = <Menu>
        <Menu.ItemGroup title="Колонки">
            {columns.map(column => {
                // Получаем текущий активный ключ вкладки и объект колонок таблиц
                const activeKey = store.getState().reducerTab.activeKey;
                const reduxColumns = store.getState().reducerMain.columnsOptions;

                // Определяем значение чекбокса
                const checked = reduxColumns && reduxColumns[activeKey]
                    ? !!reduxColumns[activeKey].find(item => item.key === column.key)
                    : true;

                return (
                    <Menu.Item key={column.key + "-checkbox"}>
                        <Checkbox id={column.key} onChange={onChange} checked={checked}>
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
                specKey === "departments" || specKey === "equipment"
                    ? <Button
                        className={`button ${short}`}
                        icon={expand ? <ExpandAltOutlined /> : <ShrinkOutlined />}
                        type="secondary"
                        onClick={() => {
                            table.expandAll(expand);

                            setExpand(!expand);
                        }}
                    >
                        {getContent(expand ? "Свернуть" : "Развернуть")}
                    </Button>
                    : null
            }
            {
                user && checkRoleUser(specKey, user).edit && specKey !== "logs"
                    ? <Button
                        className={`button ${short}`}
                        icon={<PlusOutlined/>}
                        type="primary"
                        onClick={() => openRecordTab(specKey, "-1")}
                    >
                        {getContent("Добавить")}
                    </Button>
                    : null
            }

            {
                user && checkRoleUser(specKey, user).edit && specKey === "logs"
                    ? <Popconfirm
                        title="Удалить всё за выбранный период?"
                        okText="Удалить"
                        visible={visiblePopConfirm}
                        onConfirm={async () => {
                            await LogRoute.deleteByPeriod(setLoadingDelete, setVisiblePopConfirm);
                        }}
                        onCancel={() => setVisiblePopConfirm(false)}
                        okButtonProps={{loading: loadingDelete}}
                        icon={<QuestionCircleOutlined style={{color: "red"}}/>}
                    >
                        <Button
                            className={`button ${short}`}
                            type="danger"
                            icon={<DeleteOutlined/>}
                            onClick={() => setVisiblePopConfirm(true)}
                        >
                            {getContent("Удалить")}
                        </Button>
                    </Popconfirm>
                    : null
            }

            <Button className={`button ${short}`} icon={<FileExcelOutlined/>} onClick={table.export}>
                {getContent("Экспорт")}
            </Button>

            <PrintButton specKey={specKey} short={short} getContent={getContent} table={table}/>

            <Dropdown overlay={dropdownMenu} onVisibleChange={handleVisibleChange} visible={visible}>
                <Button className={`button ${short} last_button`} icon={<EditOutlined/>}>
                    {getContent("Колонки")}
                </Button>
            </Dropdown>
        </div>
    );
};