// Компонент, отрисовывающий раздел "Журнал дефектов и отказов"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {LogDOColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import LogDOTable from "../tables/LogDoTable";

const SECTION_NAME = "logDO";

export const LogDOSection = () => {
    // Данные таблицы "Журнал дефектов и отказов"
    const {logDO, errorTableLogDO} = useSelector(state => state.reducerLogDO);

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
    const columns = LogDOColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: logDO,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-logDo",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new LogDOTable(options);

    // Инициализация ошибки раздела "Журнал дефектов и отказов"
    const error = errorTableLogDO
        ? {
            errorText: errorTableLogDO,
            action: ActionCreator.ActionCreatorLogDO.setErrorTableLogDO(null)
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