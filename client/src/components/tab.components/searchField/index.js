// Компонент, отрисовывающий поле для поиска
import React, {useMemo} from "react";
import {Input} from "antd";

import "./tabsHeader.css";

export const SearchField = ({filterText, setFilterText}) => {
    return useMemo(() => (
        <Input.Group compact>
            <Input.Search
                defaultValue=""
                type="text"
                value={filterText}
                placeholder="Поиск"
                allowClear
                onChange={e => setFilterText(e.target.value)} onPressEnter={e => setFilterText(e.target.value)}
            />
        </Input.Group>
    ), [filterText, setFilterText]);
};