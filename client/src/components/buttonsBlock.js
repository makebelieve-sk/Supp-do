import React from 'react';
import {useSelector} from "react-redux";
import {Button, Row} from 'antd';
import {PlusOutlined, FileExcelOutlined, PrinterOutlined, EditOutlined} from '@ant-design/icons';

import {ProfessionTab} from "./tabs/professionTab";
import {DepartmentTab} from "./tabs/departmentTab";
import {PersonTab} from "./tabs/personTab";

export const ButtonsComponent = ({add, specKey, onExport}) => {
    const tabs = useSelector(state => state.tabs);

    return (
        <Row justify="end">
            <Button icon={<PlusOutlined/>} type="primary"
                onClick={() => {
                    if (specKey === 'profession') {
                        add('Создание профессии', ProfessionTab, 'newProfession', tabs)
                    } else if (specKey === 'department') {
                        add('Создание подразделения', DepartmentTab, 'newDepartment', tabs);
                    } else if (specKey === 'person') {
                        add('Создание записи о сотруднике', PersonTab, 'newPerson', tabs);
                    }
                }}>Добавить
            </Button>
            <Button icon={<FileExcelOutlined />} size="middle" style={{marginLeft: 10}}
                    onClick={e => onExport(e.target.value)}>Экспорт</Button>
            <Button icon={<PrinterOutlined />} size="middle" style={{marginLeft: 10}}
                    onClick={() => alert(`Печать`)}>Печать</Button>
            <Button icon={<EditOutlined />} size="middle" style={{marginLeft: 10}}
                    onClick={() => alert(`Колонки`)}>Колонки</Button>
        </Row>
    );
};