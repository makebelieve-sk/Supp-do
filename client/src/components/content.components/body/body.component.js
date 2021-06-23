// Компонент, отрисовывающий содержимое вкладки таблицы или компонент ошибки
import React from "react";
import {useSelector} from "react-redux";
import {Card, Skeleton} from "antd";

import "./body.css";

export const BodyManager = ({sectionComponent, specKey}) => {
    const {loadingSkeleton} = useSelector(state => state.reducerLoading);

    return <div className="container-dto">
        <Skeleton loading={loadingSkeleton} active>
            <Card className={specKey === "logDO" ? "card-dto-logDo" : "card-dto"}>
                {sectionComponent()}
            </Card>
        </Skeleton>
    </div>
};