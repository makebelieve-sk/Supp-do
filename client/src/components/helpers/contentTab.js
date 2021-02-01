import React from 'react';
import {Card, Tabs} from 'antd';

import {DataTableComponent} from '../contentComponent/datatableComponent';
import {TreeComponent} from "../contentComponent/treeComponent";

const {TabPane} = Tabs;

export const ContentTab = ({add, specKey, onRemove, loadingData}) => {
    let component;

    // Если вкладка "Подразделения", то в её содержимое добавляем вкладки "Таблица" и "Дерево", иначе возвращаем таблицу
    if (specKey === 'department') {
        component = (
            <div className="container">
                <Card style={{width: '100%', marginTop: 16}}>
                    <Tabs defaultActiveKey="table">
                        <TabPane tab="Таблица" key="table">
                            <DataTableComponent add={add} specKey={specKey} loadingData={loadingData}/>
                        </TabPane>
                        <TabPane tab="Дерево" key="tree">
                            <TreeComponent/>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    } else {
        component = (
            <div className="container">
                <Card style={{width: '100%', marginTop: 16}}>
                    <DataTableComponent add={add} specKey={specKey} loadingData={loadingData}/>
                </Card>
            </div>
        )
    }

    return component;
};