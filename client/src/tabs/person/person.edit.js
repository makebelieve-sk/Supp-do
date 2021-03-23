// Вкладка записи раздела "Персонал"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {PersonForm} from "./person.form";

export const PersonTab = () => {
    // Получение записи и состояния загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerPerson.rowDataPerson,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <PersonForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}