// Вкладка раздела "Характеристики оборудования"
import React, {useMemo} from "react";
import {Card, Row, Col, Skeleton} from "antd";
import {useSelector} from "react-redux";

import {EquipmentPropertyForm} from "./equipmentProperty.form";

export const EquipmentPropertyTab = () => {
    // Получение списка характеристик оборудования и загрузки записи
    const {item, loadingSkeleton} = useSelector(state => ({
        item: state.reducerEquipmentProperty.rowDataEquipmentProperty,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <EquipmentPropertyForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}
