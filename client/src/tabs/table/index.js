// Компонент, отрисовывающий таблицу
import React, {useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {Row, Col} from "antd";

import {TableHeaderComponent} from "../../components/tab.components/tableHeader";
import {TableAlertComponent} from "../../components/tab.components/tableAlert";
import {TableBadgeComponent} from "../../components/tab.components/tableBadge";

import getTableConstructor from "../../helpers/mappers/tabs.mappers/getTableConstructor";
import {getColumns} from "../../helpers/mappers/tabs.mappers/table.helper";

import "./table.css";

export const TableComponent = ({specKey}) => {
    // Данные таблицы
    const data = useSelector(state => ({
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        logDO: state.reducerLogDO.logDO,
        help: state.reducerHelp.help,
        users: state.reducerUser.users,
        roles: state.reducerRole.roles,
        statisticRating: state.reducerStatistic.statisticRating,
        statisticList: state.reducerStatistic.statisticList,
        logs: state.reducerLog.logs,
    }));

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
    const columns = useMemo(() => getColumns(specKey), [specKey]);

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Объект, передаваемый в конструктор таблицы
    const options = {
        data: data[specKey],
        columns: columns,
        columnsOptions: settings.columns ? settings.columns[specKey] : columnsTable,
        pageSize: settings.pageSize ? settings.pageSize[specKey] : null,
        filterText: filterText.toLowerCase(),
        loading: settings.loading
    };

    // Определяем конструктор таблицы
    const Table = getTableConstructor(specKey);

    // Вызов нового объекта класса таблицы
    const table = new Table(options);

    return (
        <>
            {/*Поиск, Дата с ... по ..., Кнопки таблицы*/}
            <TableHeaderComponent
                data={table.getData()}
                specKey={specKey}
                filterText={filterText}
                setFilterText={setFilterText}
                setColumnsTable={setColumnsTable}
            />

            {/*Легенда статусов*/}
            <TableBadgeComponent legend={settings.legend} specKey={specKey}/>

            {/*Блок фильтров таблицы*/}
            <TableAlertComponent alert={settings.alert} specKey={specKey}/>

            {/*Таблица*/}
            <Row>
                <Col span={24}>
                    { table.render() }
                </Col>
            </Row>
        </>
    );
}