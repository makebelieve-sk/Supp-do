// Компонент, отрисовывающий раздел "Помощь"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {HelpColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import HelpTable from "../tables/HelpTable";

const SECTION_NAME = "help";

export const HelpSection = () => {
    // Данные таблицы "Помощь"
    const {help, errorTableHelp} = useSelector(state => state.reducerHelp);

    // Настройки таблицы
    const settings = useSelector(state => ({
        loading: state.reducerLoading.loadingTable,
        legend: state.reducerLogDO.legend,
        alert: state.reducerLogDO.alert,
        activeKey: state.reducerTab.activeKey,
        pageSize: state.reducerMain.pageSizeOptions,
        columns: state.reducerMain.columnsOptions,
    }));

    // Получение колонок таблицы
    const columns = HelpColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: help,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new HelpTable(options);

    // Инициализация ошибки раздела "Помощь"
    const error = errorTableHelp
        ? {
            errorText: errorTableHelp,
            action: ActionCreator.ActionCreatorHelp.setErrorTableHelp(null)
        }
        : null;

    return error
        ? <ErrorIndicator error={error}/>
        : <TableComponent
            filterText={filterText}
            setFilterText={setFilterText}
            setColumnsTable={setColumnsTable}
            table={table}
            settings={settings}
        />;
}