import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {Button, Row, Menu, Dropdown, Checkbox} from 'antd';
import {PlusOutlined, FileExcelOutlined, PrinterOutlined, EditOutlined} from '@ant-design/icons';

import {ProfessionTab} from "./tabs/professionTab";
import {DepartmentTab} from "./tabs/departmentTab";
import {PersonTab} from "./tabs/personTab";
import {ProfessionColumns, DepartmentColumns, PersonColumns} from "../datatable.options/datatable.columns";

export const ButtonsComponent = ({add, specKey, onExport, checkedColumns, setCheckedColumns, setColumnsTable, initialColumns}) => {
    // Получение табов из хранилища redux
    const tabs = useSelector(state => state.tabs);
    // Стейт для отображения выпадающего меню для колонок
    const [visible, setVisible] = useState(false);

    let columns = ProfessionColumns;

    if (specKey === 'department') {
        columns = DepartmentColumns;
    } else if (specKey === 'person') {
        columns = PersonColumns;
    }

    // Фукнция изменения видимости колонок
    const onChange = (e) => {
        let checkedColumnsTable = checkedColumns;

        if (e.target.checked) {
            checkedColumnsTable = checkedColumnsTable.filter(id => {
                return id !== e.target.id;
            });
        } else if (!e.target.checked) {
            if (Array.isArray(e.target.id)) {
                let arr = ['name'];
                arr.unshift(e.target.id);
                checkedColumnsTable.push(arr);
            } else {
                checkedColumnsTable.push(e.target.id);
            }
        }

        let filtered = initialColumns;

        for (let i = 0; i < checkedColumnsTable.length; i++)
            filtered = filtered.filter(el => {
                let dataIndex = el.dataIndex;

                if (Array.isArray(dataIndex)) {
                    dataIndex = dataIndex[0];
                }
                return dataIndex !== checkedColumnsTable[i];
            });

        setColumnsTable(filtered)
        setCheckedColumns(checkedColumnsTable);
    }

    // Создание переменной для отображения выпадющего списка для колонок
    let component = (
        <>
            <Menu>
                <Menu.ItemGroup title="Колонки">
                    {columns.map((column) => {
                        return (
                            <Menu.Item key={column.key + '-checkbox'}>
                                <Checkbox
                                    id={column.key}
                                    onChange={onChange}
                                    defaultChecked>{column.title}
                                </Checkbox>
                            </Menu.Item>
                        )
                    })}
                </Menu.ItemGroup>
            </Menu>
        </>
    );

    // Функция для изменения стейта отображения выпадающего списка колонок
    const handleVisibleChange = flag => {
        setVisible(flag);
    };

    return (
        <Row justify="end">
            <Button icon={<PlusOutlined/>} type="primary"
                    onClick={() => {
                        if (specKey === 'profession') {
                            add('Создание профессии', ProfessionTab, 'newProfession', tabs);
                        } else if (specKey === 'department') {
                            add('Создание подразделения', DepartmentTab, 'newDepartment', tabs);
                        } else if (specKey === 'person') {
                            add('Создание записи о сотруднике', PersonTab, 'newPerson', tabs);
                        }
                    }}>Добавить
            </Button>
            <Button icon={<FileExcelOutlined/>} size="middle" style={{marginLeft: 10}}
                    onClick={e => onExport(e.target.value)}>Экспорт</Button>
            <Button icon={<PrinterOutlined/>} size="middle" style={{marginLeft: 10}}
                    onClick={() => alert(`Печать`)}>Печать</Button>
            <Dropdown
                overlay={component}
                onVisibleChange={handleVisibleChange}
                visible={visible}
            >
                <Button icon={<EditOutlined/>} size="middle" style={{marginLeft: 10}}>Колонки</Button>
            </Dropdown>
        </Row>
    );
};