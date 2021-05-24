// Вкладка записи раздела "Журнал дефектов и отказов"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {LogDoForm} from "./form";
import ErrorIndicator from "../../components/content.components/errorIndicator/errorIndicator.component";

export const LogDOTab = () => {
    // Получение записи, состояния загрузки записи и состояние ошибки
    const {loadingSkeleton, item, error} = useSelector(state => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        item: state.reducerLogDO.rowDataLogDO,
        error: state.reducerLogDO.errorRecordLogDO
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
                            if (item) return <LogDoForm item={item} />

                            return null;
                        }, [item, error])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}