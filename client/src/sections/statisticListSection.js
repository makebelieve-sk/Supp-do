// Компонент, отрисовывающий раздел "Перечень незакрытых заявок"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {StatisticListColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import StatisticListTable from "../tables/StatisticListTable";

const SECTION_NAME = "statisticList";

export const StatisticListSection = () => {
    // Данные таблицы "Перечень незакрытых заявок"
    const {statisticList, errorList} = useSelector(state => state.reducerStatistic);

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
    const columns = StatisticListColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: statisticList,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new StatisticListTable(options);

    // Инициализация ошибки раздела "Перечень незакрытых заявок"
    const error = errorList
        ? {
            errorText: errorList,
            action: ActionCreator.ActionCreatorStatistic.setErrorList(null)
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