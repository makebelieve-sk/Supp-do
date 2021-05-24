// Вкладка записи раздела "Роли"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {RoleForm} from "./form";
import ErrorIndicator from "../../components/content.components/errorIndicator/errorIndicator.component";

export const RoleTab = () => {
    // Получение списка ролей и состояния загрузки записи
    const {item, loadingSkeleton, error} = useSelector((state) => ({
        item: state.reducerRole.rowDataRole,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        error: state.reducerRole.errorRecordRole
    }));

    const display = loadingSkeleton ? "none" : "block"; // Установка стиля отображения содержимого вкладки

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => {
                            if (error) return <ErrorIndicator error={error} />
                            if (item) return <RoleForm item={item} />

                            return null;
                        }, [item, error])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}