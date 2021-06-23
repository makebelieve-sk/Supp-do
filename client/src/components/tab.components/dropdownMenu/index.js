// Компонент, отрисовывающий колонки таблицы в выпадающием списке
import React, {useState} from "react";
import {Checkbox, Menu} from "antd";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";

export const DropdownMenuComponent = ({setColumnsTable, table}) => {
    // Создание состояний для для колонок таблицы
    const [checkedColumns, setCheckedColumns] = useState([]);

    // Получение колонок таблицы
    const columns = table.columns;

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
        let activeKey = store.getState().reducerTab.activeKey;

        if (activeKey === "statistic") {
            activeKey = store.getState().reducerTab.statisticKey;
        }

        // Обновляем колонки раздела в редаксе
        const columnsOptions = store.getState().reducerMain.columnsOptions;
        columnsOptions[activeKey] = filtered;
        store.dispatch(ActionCreator.ActionCreatorMain.setColumns(columnsOptions));
    }

    return (
        <Menu>
            <Menu.ItemGroup title="Колонки">
                {columns.map(column => {
                    // Получаем текущий активный ключ вкладки и объект колонок таблиц
                    let activeKey = store.getState().reducerTab.activeKey;
                    const reduxColumns = store.getState().reducerMain.columnsOptions;

                    if (activeKey === "statistic") {
                        activeKey = store.getState().reducerTab.statisticKey;
                    }

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
        </Menu>
    )
};