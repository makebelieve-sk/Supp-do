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

    // Получение данных для таблицы
    const data = getTableData(specKey);

    // Получение индикатора загрузки таблицы
    const loadingTable = useSelector(state => state.reducerLoading.loadingTable);
    const dispatch = useDispatch();

    // Создание стейта для текстового поля, отфильтрованных колонок, выбранных колонок и начальных колонок
    const [filterText, setFilterText] = useState("");
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
                loading={loadingTable}
            />
        </>
    );
}