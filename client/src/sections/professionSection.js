// Компонент, отрисовывающий раздел "Профессии"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {ProfessionColumns} from "../options/tab.options/table.options/columns";
import ProfessionTable from "../tables/ProfessionTable";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import {sectionKeys} from "../options";

const SECTION_NAME = sectionKeys.professions;

export const ProfessionSection = () => {
    // Данные таблицы "Профессии"
    const {professions, errorTableProfession} = useSelector(state => state.reducerProfession);

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
    const columns = ProfessionColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: professions,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new ProfessionTable(options);

    // Инициализация ошибки раздела "Профессии"
    const error = errorTableProfession
        ? {
            errorText: errorTableProfession,
            action: ActionCreator.ActionCreatorProfession.setErrorTableProfession(null)
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