import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Card, Row, Table} from "antd";

import {ProfessionColumns} from "../datatable.options/datatable.columns";
import {HeaderDatatable} from './headerDatatable';
import {ButtonsComponent} from "./buttonsBlock";
import {downloadCSV, localeRu, pagination} from '../datatable.options/datatable.options';
import {ProfessionTab} from "./tabs/professionTab";
import ActionCreator from "../redux/actionCreators";

export const DataTableComponent = ({add, specKey}) => {
    let {data, tabs} = useSelector(state => ({
        data: state.profession,
        tabs: state.tabs
    }));
    const dispatch = useDispatch();

    // Создание стейта для текстового поля
    const [filterText, setFilterText] = useState('');

    // Фильтраця данных через строку поиска
    const filteredItems = data.filter(item =>
        (item.notes && item.notes.toLowerCase().includes(filterText.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
        <Card style={{width: 300, marginTop: 16}}>
            <Row justify="space-between" style={{width: '100%', marginBottom: 20}}>
                <HeaderDatatable
                    filterText={filterText}
                    setFilterText={setFilterText}
                />
                <ButtonsComponent add={add} onExport={() => downloadCSV(data)}/>
            </Row>

            <Table
                columns={ProfessionColumns}
                dataSource={filteredItems}
                scroll={{x: 500}}
                size="middle"
                locale={localeRu}
                bordered
                pagination={pagination}
                loading={false}
                rowKey={(record) => record._id.toString()}
                onRow={(row) => ({
                    onClick: () => {
                        dispatch(ActionCreator.editTab(row));
                        add('Редактирование профессии', ProfessionTab, `updateProfession-${row._id}`, tabs);
                    }
                })}
            />
        </Card>
    );
};