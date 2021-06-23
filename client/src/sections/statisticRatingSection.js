// Компонент, отрисовывающий раздел "Рейтинг отказов"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {StatisticRatingColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import StatisticRatingTable from "../tables/StatisticRatingTable";
import {sectionKeys} from "../options";

const SECTION_NAME = sectionKeys.statisticRating;

export const StatisticRatingSection = () => {
    // Данные таблицы "Рейтинг отказов"
    const {statisticRating, errorRating} = useSelector(state => state.reducerStatistic);

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
    const columns = StatisticRatingColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: statisticRating,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new StatisticRatingTable(options);

    // Инициализация ошибки раздела "Рейтинг отказов"
    const error = errorRating
        ? {
            errorText: errorRating,
            action: ActionCreator.ActionCreatorStatistic.setErrorRating(null)
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