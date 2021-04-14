import React, {useMemo} from "react";
import {Input, Row} from "antd";

import "./tabsHeader.css";

export const Header = ({filterText, setFilterText}) => {
    // Фукнция вызывается, когда изменяются переменные в массиве зависимостей
    return useMemo(() => {
        return (
            <Input.Group compact>
                <Input.Search defaultValue="" type="text" value={filterText}
                              placeholder="Поиск"
                              onChange={e => setFilterText(e.target.value)} allowClear
                              onPressEnter={e => setFilterText(e.target.value)}/>
            </Input.Group>
        );
    }, [filterText, setFilterText]);
};