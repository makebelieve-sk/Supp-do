import React from 'react';
import {Button, Row} from 'antd';
import {PlusOutlined, FileExcelOutlined, PrinterOutlined, EditOutlined} from '@ant-design/icons';

import {ProfessionTab} from "./tabs/professionTab";
import {useSelector} from "react-redux";

export const ButtonsComponent = ({add, onExport}) => {
    const tabs = useSelector(state => state.tabs);

    return (
        <Row justify="end">
            <Button icon={<PlusOutlined/>} type="primary"
                onClick={() => add('Создание профессии', ProfessionTab, 'newProfession', tabs)}>Добавить
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