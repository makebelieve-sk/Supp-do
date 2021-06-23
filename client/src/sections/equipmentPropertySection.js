// Компонент, отрисовывающий раздел "Характеристики оборудования"
import React, {useState} from "react";
import {useSelector} from "react-redux";

import {EquipmentPropertyColumns} from "../options/tab.options/table.options/columns";
import {TableComponent} from "../tabs/table";
import ErrorIndicator from "../components/content.components/errorIndicator/errorIndicator.component";
import {ActionCreator} from "../redux/combineActions";
import EquipmentPropertyTable from "../tables/EquipmentPropertyTable";
import {sectionKeys} from "../options";

const SECTION_NAME = sectionKeys.equipmentProperties;

export const EquipmentPropertySection = () => {
    // Данные таблицы "Характеристики оборудования"
    const {equipmentProperties, errorTableEquipmentProperty} = useSelector(state => state.reducerEquipmentProperty);

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
    const columns = EquipmentPropertyColumns;

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: equipmentProperties,
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[SECTION_NAME] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[SECTION_NAME] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading,
        className: "table-usual",
        sectionName: SECTION_NAME
    };

    // Вызов нового объекта класса таблицы
    const table = new EquipmentPropertyTable(options);

    // Инициализация ошибки раздела "Характеристики оборудования"
    const error = errorTableEquipmentProperty
        ? {
            errorText: errorTableEquipmentProperty,
            action: ActionCreator.ActionCreatorEquipmentProperty.setErrorTableEquipmentProperty(null)
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