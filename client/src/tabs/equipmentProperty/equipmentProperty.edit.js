// Вкладка раздела "Характеристики оборудования"
import React, {useMemo} from "react";
import {Card, Row, Col, Skeleton} from "antd";
import {useSelector} from "react-redux";

import {EquipmentPropertyForm} from "./equipmentProperty.form";
import ErrorIndicator from "../../components/content.components/errorIndicator/errorIndicator.component";

export const EquipmentPropertyTab = () => {
    // Получение списка характеристик оборудования и загрузки записи
    const {item, loadingSkeleton, error} = useSelector(state => ({
        item: state.reducerEquipmentProperty.rowDataEquipmentProperty,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        error: state.reducerEquipmentProperty.errorRecord,
    }));

    const display = loadingSkeleton ? "none" : "block"; // Установка стиля отображения содержимого вкладки

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => {
                            if (error) return <ErrorIndicator errorText={error} />
                            if (item) return <EquipmentPropertyForm item={item} />

                            return null;
                        }, [item, error])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}
