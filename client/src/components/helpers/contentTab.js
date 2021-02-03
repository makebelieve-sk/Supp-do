import React from 'react';
import {Card, Skeleton, Tabs} from 'antd';

import {DataTableComponent} from '../contentComponent/datatableComponent';
import {TreeComponent} from "../contentComponent/treeComponent";

const {TabPane} = Tabs;

export const ContentTab = ({add, specKey, onRemove, loadingData}) => {
    let component;

    // Если вкладка "Подразделения", то в её содержимое добавляем вкладки "Таблица" и "Дерево", иначе возвращаем таблицу
    if (specKey === 'departments') {
        component = (
            <div className="container-dto">
                <Skeleton loading={loadingData} active>
                    <Card className="card-dto">
                        <Tabs defaultActiveKey="table">
                            <TabPane tab="Таблица" key="table">
                                <DataTableComponent add={add} specKey={specKey} loadingData={loadingData}/>
                            </TabPane>
                            <TabPane tab="Дерево" key="tree">
                                <TreeComponent/>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Skeleton>
            </div>
        )
    } else {
        component = (
            <div className="container-dto">
                <Skeleton loading={loadingData} active>
                    <Card className="card-dto">
                        <DataTableComponent add={add} specKey={specKey} loadingData={loadingData}/>
                    </Card>
                </Skeleton>
            </div>
        )
    }

    return component;
};