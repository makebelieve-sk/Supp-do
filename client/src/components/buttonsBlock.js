import React from 'react';
import { Button } from 'antd';

export const ButtonsComponent = ({ onExport }) => {
    return (
        <>
            <Button type="primary" style={{width: `7em`}} onClick={() => alert(1)}>
                Добавить
            </Button>
            <Button size="middle" style={{width: `7em`}} onClick={e => onExport(e.target.value)}>Экспорт</Button>
            <Button size="middle" style={{width: `7em`}} onClick={() => alert(`Печать`)}>Печать</Button>
            <Button size="middle" style={{width: `7em`}} onClick={() => alert(`Колонки`)}>Колонки</Button>
        </>
    );
};