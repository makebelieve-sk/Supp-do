// Вкладка записи раздела "Состояние заявки"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {TaskStatusForm} from "./taskStatus.form";

export const TaskTab = () => {
    // Получение списка состояний заявок и загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerTask.rowDataTask,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <TaskStatusForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}