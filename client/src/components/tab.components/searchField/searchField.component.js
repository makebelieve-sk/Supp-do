// Компонент поля для поиска
import React, {useMemo} from "react";
import {Input} from "antd";

import "./tabsHeader.css";

export const SearchField = ({filterText, setFilterText}) => {
    // Фукнция вызывается, когда изменяются переменные в массиве зависимостей
    return useMemo(() => {
        return (
            <Input.Group compact>
                <Input.Search defaultValue="" type="text" value={filterText} placeholder="Поиск" allowClear
                    onChange={e => setFilterText(e.target.value)} onPressEnter={e => setFilterText(e.target.value)}/>
            </Input.Group>
        );
    }, [filterText, setFilterText]);
};