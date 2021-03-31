import React, {useMemo} from "react";
import {Input, Row} from "antd";

import "./tabsHeader.css";

export const Header = ({filterText, setFilterText}) => {
    // Фукнция вызывается, когда изменяются переменные в массиве зависимостей
    return useMemo(() => {
        return (
            <Row style={{marginTop: 10, marginRight: 10}}>
                <Input.Group compact>
                    <Input.Search defaultValue="" type="text" value={filterText}
                                  placeholder="Поиск"
                                  onChange={e => setFilterText(e.target.value)} allowClear
                                  onPressEnter={e => setFilterText(e.target.value)}/>
                </Input.Group>
            </Row>
        );
    }, [filterText, setFilterText]);
};