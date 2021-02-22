import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {message, Row, Table, DatePicker} from "antd";
import {CheckOutlined} from '@ant-design/icons';
import moment from "moment";

import {downloadCSV, pagination} from '../../../options/table.options/datatable.options';
import {Header} from './header';
import {ButtonsComponent} from "./buttons";
import {ColumnsMapHelper, RowMapHelper} from "../../helpers/table.helpers/tableMap.helper";
import {request} from "../../helpers/request.helper";
import {ActionCreator} from "../../../redux/combineActions";

const { RangePicker } = DatePicker;

const dateFormat = "DD.MM.YYYY HH:mm";

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
    const dispatch = useDispatch();

    let data = stateObject[specKey];

    // Создание стейта для текстового поля, отфильтрованных колонок, выбранных колонок и начальных колонок
    const [filterText, setFilterText] = useState('');
    const [columnsTable, setColumnsTable] = useState(columns);
    const [checkedColumns, setCheckedColumns] = useState([]);

    // Фильтрация данных через строку поиска
    let dataKeys = [];
    let filteredItems = new Set();

    if (data && data.length > 0) {
        // Если поле isFinish = true, то устанавливаем иконку "Галочка"
        if (specKey === 'tasks') {
            data.forEach(task => {
                if (task.isFinish) {
                    task.isFinish = <CheckOutlined />;
                }
            })
        }

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
                            if (item[key].name.toLowerCase().includes(filterText.toLowerCase())) {
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
        downloadCSV(data, specKey) : message.error('Записи в таблице отсутствуют');

    // Изменение времени в датапикере
    const onChange = async (value, dateString) => {
        try {
            // Получаем данные от сервера за указанный период
            const data = await request("/api/log-do/" + dateString[0] + "/" + dateString[1]);

            // Если ответ от сервера есть, то обновляем список записей в хранилище redux
            if (data) {
                dispatch(ActionCreator.ActionCreatorLogDO.getAllLogDO(data));
            }
        } catch (e) {
            message.error(
                "Возникла ошибка при получении данных за выбранный период: " + dateString[0] + "/" + dateString[1]
            );
        }
    }

    return (
        <>
            <Row className="container-row-dto" justify="space-between" align="bottom">
                <Header
                    filterText={filterText}
                    setFilterText={setFilterText}
                />
                {
                    specKey === "logDO" ?
                        // <Row justify="center">
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format={dateFormat}
                                onChange={onChange}
                                // style={{height: "32px"}}
                                defaultValue={[moment().startOf("month"), moment().endOf("month")]}
                            />
                        // </Row>
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
                size="middle"
                bordered
                pagination={pagination}
                rowKey={(record) => record._id.toString()}
                onRow={(rowData) => ({
                    onClick: () => {
                        // Открытие новой вкладки для редактирования записи
                        RowMapHelper(specKey, rowData);
                    }
                })}
            />
        </>
    );
};