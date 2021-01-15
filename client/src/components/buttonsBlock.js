import React from 'react';
import { Button } from 'antd';

import {ProfessionTab} from "./tabs/professionTab";
import {useSelector} from "react-redux";

export const ButtonsComponent = ({ add, onExport }) => {
    const tabs = useSelector(state => state.tabs);

    return (
        <>
            <Button type="primary" style={{width: `7em`}} onClick={() => {
                add('Создание профессии', ProfessionTab, 'newProfession', tabs);
            }}>
                Добавить
            </Button>
            <Button size="middle" style={{width: `7em`}} onClick={e => onExport(e.target.value)}>Экспорт</Button>
            <Button size="middle" style={{width: `7em`}} onClick={() => alert(`Печать`)}>Печать</Button>
            <Button size="middle" style={{width: `7em`}} onClick={() => alert(`Колонки`)}>Колонки</Button>
        </>
    );
};