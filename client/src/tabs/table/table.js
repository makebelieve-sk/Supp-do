import moment from "moment";
import React, {useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {message, Row, Table, DatePicker, Col, Badge, Alert} from "antd";
import {FilterOutlined} from "@ant-design/icons";

import {ActionCreator} from "../../redux/combineActions";
import {LogDORoute} from "../../routes/route.LogDO";
import {Header} from "../../components/tab.components/tabsHeader/tableHeader.component";
import {ButtonsComponent} from "../../components/tab.components/tableButtons/tableButtons.component";
import getTableData from "../../helpers/mappers/tabs.mappers/getTableData";
import {getColumns, openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import TabOptions from "../../options/tab.options/record.options/record.options";
import tableSettings from "../../options/tab.options/table.options/settings";
import {getFilteredData} from "../../options/global.options/global.options";

import "./table.css";

const {RangePicker} = DatePicker;

export const TableComponent = ({specKey}) => {
    // Получение колонок для таблицы
    const columns = useMemo(() => getColumns(specKey), [specKey]);

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
        date: state.reducerLogDO.date,
        legend: state.reducerLogDO.legend,
        alert: state.reducerLogDO.alert,
        activeKey: state.reducerTab.activeKey
    }));
    const dispatch = useDispatch();

    // Установка времени в датапикере
    const date = stateObject.date
        ? [
            moment(stateObject.date.split("/")[0], TabOptions.dateFormat),
            moment(stateObject.date.split("/")[1], TabOptions.dateFormat)
        ]
        : [moment().startOf(("month")), moment().endOf(("month"))];

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
                            const itemArray = item[key];

                            if (itemArray && itemArray.length) {
                                itemArray.forEach(object => {
                                    if (typeof object === "object" && filterText.length && !item.name.toLowerCase().includes(filterText.toLowerCase())) {
                                        if ((object.name && object.name.toLowerCase().includes(filterText.toLowerCase())) ||
                                            (object.notes && object.notes.toLowerCase().includes(filterText.toLowerCase()))) {
                                            filteredItems.add(object);
                                        }
                                    }
                                })
                            }
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

    // Реализация экспорта
    const onExport = () => data && data.length > 0 ?
        tableSettings.export(data, specKey) : message.error("Записи в таблице отсутствуют");

    // Изменение времени в датапикере
    const onChange = async (value, dateString) => {
        const date = dateString[0] + "/" + dateString[1];

        await LogDORoute.getAll(date);

        // Записываем текущий диапазон даты в хранилище
        dispatch(ActionCreator.ActionCreatorLogDO.setDate(date));
    }

    return (
        <>
            <Row className="container-row-dto" justify="space-between" align="bottom">
                <Row justify="space-between" align="bottom">
                    <Header filterText={filterText} setFilterText={setFilterText}/>

                    {
                        specKey === "logDO" ?
                            <RangePicker
                                allowClear={false}
                                showTime={{format: "HH:mm"}}
                                format={TabOptions.dateFormat}
                                onChange={onChange}
                                value={date}
                            /> : null
                    }
                </Row>

                <ButtonsComponent specKey={specKey} onExport={onExport} setColumnsTable={setColumnsTable}/>
            </Row>

            <Row className="row-badges">
                {
                    stateObject.legend ? stateObject.legend.map(legend => (
                        <Col key={legend.id} style={{textAlign: "center", marginRight: 5}}>
                            <Badge
                                count={`${legend.name} ${legend.count}`}
                                style={{
                                    backgroundColor: legend.color,
                                    borderColor: legend.borderColor ?  legend.borderColor : "#FFFFFF",
                                    color: legend.borderColor ?  legend.borderColor : "#FFFFFF"
                                }}
                            />
                        </Col>
                    )) : null
                }
            </Row>

            {stateObject.alert ? <Row className="row-badges">
                <Col span={24}>
                    <Alert
                        message={stateObject.alert}
                        type="warning"
                        icon={<FilterOutlined/>}
                        showIcon
                        closable
                        onClose={async () => await LogDORoute.getAll()}
                    />
                </Col>
            </Row> : null}

            <Table
                bordered
                size={tableSettings.size}
                scroll={tableSettings.scroll}
                pagination={tableSettings.pagination}
                dataSource={columnsTable && columnsTable.length === 0 ? null : Array.from(filteredItems)}
                columns={columnsTable}
                rowKey={record => record._id.toString()}
                onRow={row => ({onClick: () => openRecordTab(specKey, row._id)})}
                loading={stateObject.loadingTable}
                className={specKey === "logDO" ? "table-logDo" : "table-usual"}
            />
        </>
    );
}