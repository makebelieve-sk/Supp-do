import React, {useMemo, useState} from 'react';
import DataTable from 'react-data-table-component';
import {useSelector} from 'react-redux';

import {ProfessionColumns} from "../datatable.options/datatable.columns";
import {HeaderDatatable} from './headerDatatable';
import {ButtonsComponent} from "./buttonsBlock";
import {conditionalRowStyles} from "../dataTableStyles";
import {
    ruObject,
    noDataComponent,
    paginationRowsPerPageOptions,
    downloadCSV
} from '../datatable.options/datatable.options';

export const DataTableComponent = ({add, specKey}) => {
    let data = useSelector(state => state.profession);

    // Создание стейта для текстового поля
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(item =>
        (item.notes && item.notes.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(filterText.toLowerCase()))
    );

    const exportAction = useMemo(() =>
            <ButtonsComponent add={add} onExport={() => downloadCSV(data)}/>
        , [add, data]);

    return (
        <DataTable
            columns={ProfessionColumns}
            data={filteredItems}
            actions={exportAction}
            pagination
            paginationComponentOptions={ruObject}
            noDataComponent={noDataComponent}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            subHeader={true}
            subHeaderComponent={<HeaderDatatable
                filterText={filterText}
                setFilterText={setFilterText}
            />}
            conditionalRowStyles={conditionalRowStyles}
        />
    );
};