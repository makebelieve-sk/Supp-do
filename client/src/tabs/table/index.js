// Компонент, отрисовывающий таблицу
import React, {useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {Row, Table, Col} from "antd";

import store from "../../redux/store";
import {getColumns, getFilterFunction, openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import {createTreeData} from "../../helpers/functions/general.functions/createTreeData.helper";
import tableSettings from "../../options/tab.options/table.options/settings";
import {goToLogDO} from "../analytic";
import {TableHeaderComponent} from "../../components/tab.components/tableHeader";
import {TableAlertComponent} from "../../components/tab.components/tableAlert";
import {TableBadgeComponent} from "../../components/tab.components/tableBadge";

import "./table.css";
import {ActionCreator} from "../../redux/combineActions";

export const TableComponent = ({specKey}) => {
    // Получение данных таблиц
    const stateObject = useSelector(state => ({
        loadingTable: state.reducerLoading.loadingTable,
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
        legend: state.reducerLogDO.legend,
        alert: state.reducerLogDO.alert,
        activeKey: state.reducerTab.activeKey,
        pageSizeOptions: state.reducerMain.pageSizeOptions,
        columnsOptions: state.reducerMain.columnsOptions,
        expandRowsDepartment: state.reducerDepartment.expandRowsDepartment,
        expandRowsEquipment: state.reducerEquipment.expandRowsEquipment,
    }));

    // Получение колонок таблицы
    const columns = useMemo(() => getColumns(specKey), [specKey]);

    // Создание состояний для текстового поля, колонок таблицы
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Получение данных таблицы
    const data = specKey === "equipment" || specKey === "departments"
        ? createTreeData(stateObject[specKey])
        : stateObject[specKey];

    // Получение отфильтрованных данных таблицы
    const filterData = getFilterFunction(specKey, data.slice(0), filterText.toLowerCase());

    /**
     * Функция обработки события строки таблицы (в данном случае только событие клика)
     * @param row- строка таблицы
     * @returns {{onClick: ((function(): Promise<void>)|*)}}
     */
    const onRowEventHandler = (row) => {
        return ({
            onClick: async () => {
                if (specKey === "statisticRating" || specKey === "statisticList") {
                    specKey === "statisticRating"
                        ? await goToLogDO("/rating", {
                            satisfies: row.satisfies,
                            equipment: row.equipment,
                            date: store.getState().reducerStatistic.dateRating
                        })
                        : await goToLogDO("/list", {
                            date: store.getState().reducerStatistic.dateList
                        });
                } else {
                    openRecordTab(specKey, row._id);
                }
            }
        })
    };

    /**
     * Функция сворачивания/разворачивания строк
     * @param expanded - свёрнута/развёрнута строка таблицы (boolean)
     * @param record - строка таблицы
     */
    const onRowExpandHandler = (expanded, record) => {
        if (expanded) {
            if (specKey === "departments") {
                store.dispatch(ActionCreator.ActionCreatorDepartment.setExpandRowsDepartment([
                    ...stateObject.expandRowsDepartment,
                    record._id
                ]));
            }
            if (specKey === "equipment") {
                store.dispatch(ActionCreator.ActionCreatorEquipment.setExpandRowsEquipment([
                    ...stateObject.expandRowsEquipment,
                    record._id
                ]));
            }
        } else {
            if (specKey === "departments") {
                const indexOf = stateObject.expandRowsDepartment.indexOf(record._id);

                if (indexOf >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorDepartment.setExpandRowsDepartment([
                        ...stateObject.expandRowsDepartment.slice(0, indexOf),
                        ...stateObject.expandRowsDepartment.slice(indexOf + 1),
                    ]));
                }
            }
            if (specKey === "equipment") {
                const indexOf = stateObject.expandRowsDepartment.indexOf(record._id);

                if (indexOf >= 0) {
                    store.dispatch(ActionCreator.ActionCreatorEquipment.setExpandRowsEquipment([
                        ...stateObject.expandRowsEquipment.slice(0, indexOf),
                        ...stateObject.expandRowsEquipment.slice(indexOf + 1),
                    ]));
                }
            }
        }
    };

    // Название класса таблицы
    const classNameTable = useMemo(() => specKey === "logDO" ? "table-logDo" : "table-usual", [specKey]);

    // Массив свёрнутых/развёрнутых строк таблицы
    const expandRows = specKey === "departments"
        ? stateObject.expandRowsDepartment
        : specKey === "equipment"
            ? stateObject.expandRowsEquipment
            : [];

    return (
        <>
            {/*Поиск, Дата с ... по ..., Кнопки таблицы*/}
            <TableHeaderComponent
                data={data}
                specKey={specKey}
                filterText={filterText}
                setFilterText={setFilterText}
                setColumnsTable={setColumnsTable}
            />

            {/*Легенда статусов*/}
            <TableBadgeComponent legend={stateObject.legend} specKey={specKey}/>

            {/*Блок фильтров таблицы*/}
            <TableAlertComponent alert={stateObject.alert} specKey={specKey}/>

            {/*Таблица*/}
            <Row>
                <Col span={24}>
                    <Table
                        bordered
                        size={tableSettings.size}
                        scroll={tableSettings.scroll}
                        pagination={{
                            ...tableSettings.pagination,
                            pageSize: stateObject.pageSizeOptions && stateObject.pageSizeOptions[specKey]
                                ? stateObject.pageSizeOptions[specKey]
                                : 10
                        }}
                        expandable={{
                            defaultExpandAllRows: true,
                            expandedRowKeys: expandRows,
                            onExpand: onRowExpandHandler
                        }}
                        dataSource={columnsTable && columnsTable.length ? filterData : null}
                        columns={stateObject.columnsOptions && stateObject.columnsOptions[specKey]
                            ? stateObject.columnsOptions[specKey]
                            : columnsTable}
                        rowKey={record => record._id.toString()}
                        onRow={onRowEventHandler}
                        loading={stateObject.loadingTable}
                        className={classNameTable}
                    />
                </Col>
            </Row>
        </>
    );
}