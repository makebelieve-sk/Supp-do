// Управление содержимым вкладки с таблицей
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Skeleton} from "antd";

import getContentToTab from "../../../helpers/mappers/tabs.mappers/getContentToTab";

import "./body.css";

export const BodyManager = ({specKey}) => {
    const loadingSkeleton = useSelector(state => state.reducerLoading.loadingSkeleton);

    // Получаем контент вкладки
    const component = useMemo(() => getContentToTab(specKey), [specKey]);

    return <div className="container-dto">
        <Skeleton loading={loadingSkeleton} active>
            <Card className={specKey === "logDO" ? "card-dto-logDo" : "card-dto"}>
                {component}
            </Card>
        </Skeleton>
    </div>
};