// Компонент, отрисовывающий раздел "Перечень оборудования"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {EquipmentColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import EquipmentTable from "../tables/EquipmentTable";
import {sectionKeys} from "../options";

const SECTION_NAME = sectionKeys.equipment;

export const EquipmentSection = () => {
    // Данные таблицы "Перечень оборудования"
    const {equipment, errorTableEquipment} = useSelector(state => state.reducerEquipment);

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
    const columns = EquipmentColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: equipment,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new EquipmentTable(options);

    // Инициализация ошибки раздела "Перечень оборудования"
    const error = errorTableEquipment
        ? {
            errorText: errorTableEquipment,
            action: ActionCreator.ActionCreatorEquipment.setErrorTableEquipment(null)
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