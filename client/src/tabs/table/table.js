// Компонент таблицы
import React, {useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {Row, Table, Col} from "antd";

import getTableData from "../../helpers/mappers/tabs.mappers/getTableData";
import {getColumns, openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import tableSettings from "../../options/tab.options/table.options/settings";
import {getFilteredData} from "../../options/global.options/global.options";
import {TableHeaderComponent} from "../../components/tab.components/tableHeader/tableHeader.component";
import {TableAlertComponent} from "../../components/tab.components/tableAlert/tableAlert.component";
import {TableBadgeComponent} from "../../components/tab.components/tableBadge/tableBadge.component";

import "./table.css";
import {StatisticRatingRoute} from "../../routes/route.StatisticRating";
import {StatisticListRoute} from "../../routes/route.StatisticList";
import store from "../../redux/store";
import {goToLogDO} from "../../components/content.components/analytic/analytic.component";

export const TableComponent = ({specKey}) => {
    // Получение индикатора загрузки таблицы и записей всех разделов
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
        legend: state.reducerLogDO.legend,
        alert: state.reducerLogDO.alert,
        activeKey: state.reducerTab.activeKey,
    }));

    // Получение колонок для таблицы и состояния для редактирования записи
    const columns = useMemo(() => getColumns(specKey), [specKey]);

    // Создание стейта для текстового поля, отфильтрованных колонок, выбранных колонок и начальных колонок
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);

    // Получение данных для таблицы
    const data = getTableData(specKey, stateObject[specKey]);

    let dataKeys = [];
    let filteredItems = new Set();

    // Реализация поиска
    if (data && data.length > 0) {
        // Находим поля объектов записи
        dataKeys = Object.keys(data[0]);

        // Фильтруем нужные для поиска поля
        const filteredDataKeys = getFilteredData(dataKeys);

        data.forEach(item => {
            if (filteredDataKeys && filteredDataKeys.length) {
                filteredDataKeys.forEach(key => {
                    if (item[key]) {
                        // поле - массив объектов (древовидная структура данных)
                        if (Array.isArray(item[key])) {
                            const rek = (value, item) => {
                                const itemArray = value;

                                if (itemArray && itemArray.length) {
                                    itemArray.forEach(object => {
                                        if (typeof object === "object") {
                                            if (filterText.length && !item.name.toLowerCase().includes(filterText.toLowerCase())) {
                                                if ((object.name && object.name.toLowerCase().includes(filterText.toLowerCase())) ||
                                                    (object.notes && object.notes.toLowerCase().includes(filterText.toLowerCase()))) {
                                                    filteredItems.add(object);
                                                }
                                            }
                                        }

                                        if (Array.isArray(object.children)) {
                                            rek(object.children, object);
                                        }
                                    })
                                }
                            }

                            rek(item[key], item);
                        }

                        // поле - строка
                        if (typeof item[key] === "string") {
                            if (item[key].toLowerCase().includes(filterText.toLowerCase())) {
                                filteredItems.add(item);
                            }
                        }
                    }
                })
            }
        });
    }

    return (
        <>
            <TableHeaderComponent
                data={data}
                specKey={specKey}
                filterText={filterText}
                setFilterText={setFilterText}
                setColumnsTable={setColumnsTable}
            />

            <TableBadgeComponent legend={stateObject.legend} specKey={specKey}/>

            <TableAlertComponent alert={stateObject.alert} specKey={specKey}/>

            <Row>
                <Col span={24}>
                    <Table
                        bordered
                        size={tableSettings.size}
                        scroll={tableSettings.scroll}
                        pagination={tableSettings.pagination}
                        dataSource={columnsTable && columnsTable.length === 0 ? null : Array.from(filteredItems)}
                        columns={columnsTable}
                        rowKey={record => record._id.toString()}
                        onRow={row => ({
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
                        })}
                        loading={stateObject.loadingTable}
                        className={specKey === "logDO" ? "table-logDo" : "table-usual"}
                    />
                </Col>
            </Row>
        </>
    );
}