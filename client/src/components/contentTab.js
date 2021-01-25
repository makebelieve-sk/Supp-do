import React from 'react';
import {Card, Tabs} from 'antd';

import {DataTableComponent} from './datatableComponent';
import {TreeComponent} from "./treeComponent";

const {TabPane} = Tabs;

export const ContentTab = ({add, specKey, onRemove, loading}) => {
    let component;

    const callback = (key) => {

    }

    if (specKey === 'department') {
        component = (
            <Card style={{width: '100%', marginTop: 16}}>
                <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Таблица" key="table">
                        <DataTableComponent add={add} specKey={specKey} loadingData={loading}/>
                    </TabPane>
                    <TabPane tab="Дерево" key="tree">
                        <TreeComponent/>
                    </TabPane>
                </Tabs>
            </Card>
        )
    } else {
        component = (
            <Card style={{width: '100%', marginTop: 16}}>
                <DataTableComponent add={add} specKey={specKey} loadingData={loading}/>
            </Card>
        )
    }
    return component;
};