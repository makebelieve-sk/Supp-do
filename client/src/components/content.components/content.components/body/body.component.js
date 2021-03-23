// Управление содержимым вкладки с таблицей
import React from "react";
import {useSelector} from "react-redux";

import {Card, Skeleton} from "antd";
import {TableComponent} from "../../../../tabs/table/table";

import "./body.css";

export const BodyManager = ({specKey}) => {
    const {loadingSkeleton} = useSelector(state => state.reducerLoading.loadingSkeleton);

    return <div className="container-dto">
        <Skeleton loading={loadingSkeleton} active>
            <Card className={specKey === "logDO" ? "card-dto-logDo" : "card-dto"}>
                <TableComponent specKey={specKey}/>
            </Card>
        </Skeleton>
    </div>
};