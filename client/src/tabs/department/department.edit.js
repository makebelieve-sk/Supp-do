// Вкладка записи раздела "Подразделения"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {DepartmentForm} from "./department.form";

export const DepartmentTab = () => {
    // Получение списка подразделений, редактируемой строки и загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerDepartment.rowDataDepartment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <DepartmentForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}