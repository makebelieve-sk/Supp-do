// Вкладка записи раздела "Профессии"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {ProfessionForm} from "./profession.form";
import ErrorIndicator from "../../components/content.components/errorIndicator/errorIndicator.component";

export const ProfessionTab = () => {
    // Получение списка профессий и состояния загрузки записи
    const {item, loadingSkeleton, error} = useSelector((state) => ({
        item: state.reducerProfession.rowDataProfession,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        error: state.reducerProfession.errorRecord
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
                            if (item) return <ProfessionForm item={item} />

                            return null;
                        }, [item, error])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}