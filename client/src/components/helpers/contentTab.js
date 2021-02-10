import React from 'react';
import {Card, Skeleton, Tabs} from 'antd';
import {useSelector} from 'react-redux';

import {DataTableComponent} from '../contentComponent/datatableComponent';
import {TreeComponent} from "../contentComponent/treeComponent";

const {TabPane} = Tabs;

export const ContentTab = ({specKey}) => {
    let component;
    const {loadingSkeleton, departments, equipment} = useSelector(state => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        departments: state.reducerDepartment.departments,
        equipment: state.reducerEquipment.equipment
    }));

    // Если вкладка "Подразделения", то в её содержимое добавляем вкладки "Таблица" и "Дерево", иначе возвращаем таблицу
    if (specKey === 'equipment') {
        component = (
            <div className="container-dto">
                <Skeleton loading={loadingSkeleton} active>
                    <Card className="card-dto">
                        <Tabs defaultActiveKey="table">
                            <TabPane tab="Таблица" key="table">
                                <DataTableComponent specKey={specKey}/>
                            </TabPane>
                            <TabPane tab="!!" key="!!">Хело ворд!
                                {/*<!!/>*/}
                            </TabPane>
                            <TabPane tab="Дерево" key="tree">
                                <TreeComponent dataStore={equipment}/>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Skeleton>
            </div>
        )
    } else if (specKey === 'departments') {
        component = (
            <div className="container-dto">
                <Skeleton loading={loadingSkeleton} active>
                    <Card className="card-dto">
                        <Tabs defaultActiveKey="table">
                            <TabPane tab="Таблица" key="table">
                                <DataTableComponent specKey={specKey}/>
                            </TabPane>
                            <TabPane tab="Дерево" key="tree">
                                <TreeComponent dataStore={departments}/>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Skeleton>
            </div>
        )
    } else {
        component = (
            <div className="container-dto">
                <Skeleton loading={loadingSkeleton} active>
                    <Card className="card-dto">
                        <DataTableComponent specKey={specKey}/>
                    </Card>
                </Skeleton>
            </div>
        )
    }

    return component;
};