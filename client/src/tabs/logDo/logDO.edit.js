// Вкладка записи раздела "Журнал дефектов и отказов"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {LogDoForm} from "./logDo.form";

export const LogDOTab = () => {
    // Получение записи и состояния загрузки записи
    const {loadingSkeleton, item} = useSelector(state => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        item: state.reducerLogDO.rowDataLogDO
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <LogDoForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}