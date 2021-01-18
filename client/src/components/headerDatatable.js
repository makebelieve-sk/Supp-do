import React, {useMemo} from 'react';
import {Input, Row} from "antd";

export const HeaderDatatable = ({filterText, setFilterText}) => {
    // Фукнция вызывается, когда изменяются переменные в массиве зависимостей
    return useMemo(() => {
        return (
            <Row>
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