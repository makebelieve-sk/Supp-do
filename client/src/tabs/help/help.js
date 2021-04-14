// Вкладка записи раздела "Помощь"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {HelpForm} from "./help.form";

export const HelpTab = () => {
    // Получение списка записей помощи и состояния загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerHelp.rowDataHelp,
        loadingSkeleton: state.reducerLoading.loadingSkeleton
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <HelpForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}