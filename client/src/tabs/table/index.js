// Компонент, отрисовывающий таблицу
import React from "react";
import {TableHeaderComponent} from "../../components/tab.components/tableHeader";
import "./table.css";

export const TableComponent = ({filterText, setFilterText, setColumnsTable, table, settings}) => (
    <>
        {/*Поиск, Дата с ... по ..., Кнопки таблицы*/}
        <TableHeaderComponent
            table={table}
            filterText={filterText}
            setFilterText={setFilterText}
            setColumnsTable={setColumnsTable}
        />

        {/*Легенда статусов*/}
        {
            table.renderBadge === undefined
                ? null
                : table.renderBadge(settings.legend)
        }

        {/*Блок фильтров таблицы*/}
        {
            table.renderAlert === undefined
                ? null
                : table.renderAlert(settings.alert)
        }

        {/*Таблица*/}
        {table.render()}
    </>
)