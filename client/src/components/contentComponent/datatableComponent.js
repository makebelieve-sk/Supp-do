import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {message, Row, Table} from "antd";
import {CheckOutlined} from '@ant-design/icons';

import {downloadCSV, pagination} from '../../datatable.options/datatable.options';
import {HeaderDatatable} from './headerDatatable';
import {ButtonsComponent} from "./buttonsDatatable";
import {useHttp} from "../../hooks/http.hook";
import {ColumnsMapHelper, RowMapHelper} from "../helpers/dataTableMap.helper";

export const DataTableComponent = ({add, specKey, loadingData}) => {
    // Получение колонок для таблицы
    const columns = ColumnsMapHelper(specKey);

    // Получение массива данных для заполнения таблицы, и получение текущих открытых вкладок
    let {data, tabs} = useSelector(state => {
        if (state[specKey]) {
            return {
                data: state[specKey],
                tabs: state.tabs
            }
        } else {
            let messageErrorText = 'Произошла ошибка при заполнении таблицы, пожалуйста, попробуйте снова';
            message.error(messageErrorText);
        }
    });

    // Получение функции создания запросов на сервер
    let {request} = useHttp();

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
    const onExport = () => {
        return data && data.length > 0 ? downloadCSV(data, specKey) : message.error('Записи в таблице отсутствуют');
    };

    return (
        <>
            <Row className="container-row-dto" justify="space-between">
                <HeaderDatatable
                    filterText={filterText}
                    setFilterText={setFilterText}
                />
                <ButtonsComponent
                    add={add}
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
                loading={loadingData}
                rowKey={(record) => record._id.toString()}
                onRow={(row) => ({
                    onClick: () => {
                        // Открытие новой вкладки для редактирования записи
                        RowMapHelper(specKey, add, tabs, request, row);
                    }
                })}
            />
        </>
    );
};