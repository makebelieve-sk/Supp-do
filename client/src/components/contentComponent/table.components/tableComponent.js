import moment from "moment";
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {message, Row, Table, DatePicker} from "antd";

import {LogDORoute} from "../../../routes/route.LogDO";
import {Header} from './header';
import {ButtonsComponent} from "./buttons";
import {ColumnsMapHelper, RowMapHelper} from "../../helpers/table.helpers/tableMap.helper";
import TabOptions from "../../../options/tab.options/tab.options";
import {downloadCSV, pagination} from '../../../options/table.options/datatable.options';
import {createTreeData} from "../../helpers/createTreeData.helper";

const {RangePicker} = DatePicker;

export const TableComponent = ({specKey}) => {
    // Получение колонок для таблицы
    const columns = ColumnsMapHelper(specKey);

    // Получение массива данных для заполнения таблицы, и получение текущих открытых вкладок
    const stateObject = useSelector(state => ({
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        tasks: state.reducerTask.tasks,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        equipment: state.reducerEquipment.equipment,
        logDO: state.reducerLogDO.logDO
    }));

    let data;

    if (specKey === "equipment" || specKey === "departments") {
        data = createTreeData(stateObject[specKey]);
    } else {
        data = stateObject[specKey];
    }

    // Создание стейта для текстового поля, отфильтрованных колонок, выбранных колонок и начальных колонок
    const [filterText, setFilterText] = useState('');
    const [columnsTable, setColumnsTable] = useState(columns);
    const [checkedColumns, setCheckedColumns] = useState([]);

    let dataKeys = [];
    let filteredItems = new Set();

    // Реализация поиска
    if (data && data.length > 0) {
        // Получаем ключи - столбцы таблицы
        dataKeys = Object.keys(data[0]);

        dataKeys.splice(0, 1);
        dataKeys.splice(dataKeys.length - 1, 1);

        data.forEach(item => {
            if (dataKeys && dataKeys.length > 0) {
                dataKeys.forEach(key => {
                    if (item[key]) {
                        if (Array.isArray(item[key])) {
                            return null;
                        }

                        if (typeof item[key] === "number") {
                            item[key] = item[key] + '';
                            if (item[key].toLowerCase().includes(filterText.toLowerCase())) {
                                filteredItems.add(item);
                            }
                        }

                        if (typeof item[key] === "object") {
                            if (item[key].name && item[key].name.toLowerCase().includes(filterText.toLowerCase())) {
                                filteredItems.add(item);
                            }
                        }

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

    // Экспорт данных
    const onExport = () => data && data.length > 0 ?
        downloadCSV(data, specKey) : message.error("Записи в таблице отсутствуют");

    // Изменение времени в датапикере
    const onChange = async (value, dateString) => await LogDORoute.getAll(dateString[0] + "/" + dateString[1]);

    return (
        <>
            <Row className="container-row-dto" justify="space-between" align="bottom">
                <Header
                    filterText={filterText}
                    setFilterText={setFilterText}
                />
                {
                    specKey === "logDO" ?
                        <RangePicker
                            allowClear={false}
                            showTime={{format: "HH:mm"}}
                            format={TabOptions.dateFormat}
                            onChange={onChange}
                            defaultValue={[moment().startOf("month"), moment().endOf("month")]}
                        />
                        : null
                }
                <ButtonsComponent
                    specKey={specKey}
                    onExport={onExport}
                    checkedColumns={checkedColumns}
                    setCheckedColumns={setCheckedColumns}
                    setColumnsTable={setColumnsTable}
                    initialColumns={columns}
                />
            </Row>

            <Table
                columns={columnsTable}
                dataSource={columnsTable && columnsTable.length === 0 ? null : Array.from(filteredItems)}
                scroll={{x: 500}}
                size="small"
                bordered
                pagination={pagination}
                rowKey={(record) => {
                    if (specKey === "equipment" || specKey === "departments") {
                        return record.key;
                    } else {
                        return record._id.toString();
                    }
                }}
                onRow={(row) => ({
                    onClick: () => {
                        let _id = row._id;

                        if (row.key && !row._id) {
                            _id = row.key;
                        }
                        // Открытие новой вкладки для редактирования записи
                        RowMapHelper(specKey, _id);
                    }
                })}
            />
        </>
    );
}