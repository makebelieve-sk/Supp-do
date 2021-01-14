import React, { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

import { HeaderDatatable } from './headerDatatable';
import { ButtonsComponent } from "./buttonsBlock";
import {conditionalRowStyles} from "../dataTableStyles";
import {
    ruObject,
    noDataComponent,
    paginationRowsPerPageOptions,
    downloadCSV
} from '../datatable.options/datatable.options';

const data = [
    { id: 1, name: '01.04.2020', notes: '613' },
    { id: 2, name: '02.04.2020', notes: '614'  },
    { id: 3, name: '03.04.2020', notes: '615' },
    { id: 4, name: '04.04.2020', notes: '616' },
];

const columns = [
    {
        name: 'Наименование',
        selector: 'name',
        sortable: true
    },
    {
        name: 'Примечание',
        selector: 'notes',
        sortable: true
    }
];

export const DataTableComponent = () => {
    // Создание стейта для текстового поля
    const [filterText, setFilterText] = useState('');

    const filteredItems = data.filter(item =>
        (item.notes && item.notes.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(filterText.toLowerCase()))
    );

    const exportAction = useMemo(() => <ButtonsComponent onExport={() => downloadCSV(data)} />, []);

    return (
        <DataTable
            columns={columns}
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