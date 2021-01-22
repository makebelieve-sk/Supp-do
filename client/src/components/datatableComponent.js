import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {message, Row, Table} from "antd";

import {ProfessionColumns, DepartmentColumns, PersonColumns} from "../datatable.options/datatable.columns";
import {downloadCSV, localeRu, pagination} from '../datatable.options/datatable.options';
import {HeaderDatatable} from './headerDatatable';
import {ButtonsComponent} from "./buttonsBlock";
import ActionCreator from "../redux/actionCreators";
import {ProfessionTab} from "./tabs/professionTab";
import {DepartmentTab} from "./tabs/departmentTab";
import {PersonTab} from "./tabs/personTab";

export const DataTableComponent = ({add, specKey, loading}) => {
    let columns = ProfessionColumns;

    let {data, tabs} = useSelector(state => {
        let object;
        if (specKey === 'profession') {
            object = {
                data: state.profession,
                tabs: state.tabs
            }
        } else if (specKey === 'department') {
            object = {
                data: state.departments,
                tabs: state.tabs
            }

            columns = DepartmentColumns;
        } else if (specKey === 'person') {
            object = {
                data: state.people,
                tabs: state.tabs
            }

            columns = PersonColumns;
        }

        return object;
    });
    const dispatch = useDispatch();

    // Создание стейта для текстового поля, отфильтрованных колонок, выбранных колонок и начальных колонок
    const [filterText, setFilterText] = useState('');
    let [columnsTable, setColumnsTable] = useState(columns);
    let [checkedColumns, setCheckedColumns] = useState([]);
    let [initialColumns, setInitialColumns] = useState([]);

    // Устанавливаем начальные значения колонок
    useEffect(() => {
        setInitialColumns(columns);
    }, [columns]);

    // Фильтрация данных через строку поиска
    const filteredItems = data.filter(item =>
        (item.notes && item.notes.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
        <>
            <Row justify="space-between" style={{width: '100%', marginBottom: 20, marginTop: 20}}>
                <HeaderDatatable
                    filterText={filterText}
                    setFilterText={setFilterText}
                />
                <ButtonsComponent
                    add={add}
                    specKey={specKey}
                    onExport={() => {
                        if (data && data.length > 0) {
                            downloadCSV(data, specKey);
                        } else {
                            message.warn('Записи в таблице отсутствуют');
                        }
                    }}
                    checkedColumns={checkedColumns}
                    setCheckedColumns={setCheckedColumns}
                    setColumnsTable={setColumnsTable}
                    initialColumns={initialColumns}
                />
            </Row>

            <Table
                columns={columnsTable}
                dataSource={columnsTable && columnsTable.length === 0 ? null : filteredItems}
                scroll={{x: 500}}
                size="middle"
                locale={localeRu}
                bordered
                pagination={pagination}
                loading={loading}
                rowKey={(record) => record._id.toString()}
                onRow={(row) => {
                    return {
                        // Открытие новой вклдки для редактирования записи
                        onClick: () => {
                            dispatch(ActionCreator.editTab(row));

                            if (specKey === 'profession') {
                                add('Редактирование профессии', ProfessionTab, 'updateProfession', tabs);
                            } else if (specKey === 'department') {
                                add('Редактирование подразделения', DepartmentTab, 'updateDepartment', tabs);
                            } else if (specKey === 'person') {
                                add('Редактирование записи о сотруднике', PersonTab, 'updatePerson', tabs);
                            }
                        }
                    }
                }}
            />
        </>
    );
};