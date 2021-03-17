import moment from "moment";
import React, {useState, useMemo} from "react";
import {useSelector, useDispatch} from "react-redux";
import {message, Row, Table, DatePicker} from "antd";

import {ActionCreator} from "../../../redux/combineActions";
import {LogDORoute} from "../../../routes/route.LogDO";
import {Header} from "./header";
import {ButtonsComponent} from "./buttons";
import getTableData from "../../helpers/table.helpers/getTableData";
import {getColumns, openRecordTab} from "../../helpers/table.helpers/table.helper";
import TabOptions from "../../../options/tab.options/tab.options";
import tableSettings from "../../../options/table.options/settings";

const {RangePicker} = DatePicker;

export const TableComponent = ({specKey}) => {
    // Получение колонок для таблицы
    const columns = useMemo(() => getColumns(specKey), [specKey]);

    // Получение индикатора загрузки таблицы
    const stateObject = useSelector(state => ({
        loadingTable: state.reducerLoading.loadingTable,
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        logDO: state.reducerLogDO.logDO,
    }));
    const dispatch = useDispatch();

    // Получение данных для таблицы
    const data = getTableData(specKey, stateObject[specKey]);

    // Создание стейта для текстового поля, отфильтрованных колонок, выбранных колонок и начальных колонок
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);
    const [checkedColumns, setCheckedColumns] = useState([]);

    let dataKeys = [], filteredDataKeys = [];
    let filteredItems = new Set();

    // Реализация поиска
    if (data && data.length > 0) {
        // Находим поля объектов записи
        dataKeys = Object.keys(data[0]);

        // Фильтруем нужные для поиска поля
        filteredDataKeys = dataKeys.filter(key => {
            return key !== "_id" && key !== "key" && key !== "__v" && key !== "files" && key !== "isFinish" &&
                key !== "sendEmail" && key !== "productionCheck" && key !== "planDateDone" && key !== "downtime" && key !== "date";
        });

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

                        // поле - объект
                        if (typeof item[key] === "object") {
                            if (item[key].name && item[key].name.toLowerCase().includes(filterText.toLowerCase())) {
                                filteredItems.add(item);
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

    // Экспорт данных
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
                <Header filterText={filterText} setFilterText={setFilterText}/>

                {
                    specKey === "logDO" ?
                        <RangePicker
                            allowClear={false}
                            showTime={{format: "HH:mm"}}
                            format={TabOptions.dateFormat}
                            onChange={onChange}
                            defaultValue={[moment().startOf("month"), moment().endOf("month")]}
                        /> : null
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
                bordered
                size={tableSettings.size}
                scroll={tableSettings.scroll}
                pagination={tableSettings.pagination}
                dataSource={columnsTable && columnsTable.length === 0 ? null : Array.from(filteredItems)}
                columns={columnsTable}
                rowKey={record => record._id.toString()}
                onRow={row => ({
                    // Открытие новой вкладки для редактирования записи по клику
                    onClick: () => openRecordTab(specKey, row._id)
                })}
                loading={stateObject.loadingTable}
            />
        </>
    );
}