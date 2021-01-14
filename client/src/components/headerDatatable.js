import React, {useMemo, useState} from 'react';
import {Row, Button} from "antd";

import {ClearButtonStyle, SearchFieldStyle} from "../dataTableStyles";

export const HeaderDatatable = ({filterText, setFilterText}) => {
    // Создание стейта, сбрасывающего пагинацию при изменении значения в текстовом поле
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Фукнция вызывается, когда изменяются переменные в массиве зависимостей
    return useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <>
                <Row style={{right: 0}}>
                    <input style={SearchFieldStyle} id="search" type="text" placeholder="Поиск"
                           aria-label="Search Input"
                           value={filterText} onChange={e => setFilterText(e.target.value)}/>
                    <Button size="small" type="primary" style={ClearButtonStyle} onClick={handleClear}>X</Button>

                </Row>
            </>
        );
    }, [filterText, setFilterText, resetPaginationToggle]);
};