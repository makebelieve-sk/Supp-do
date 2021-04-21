// Управление содержимым вкладки с таблицей
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Skeleton} from "antd";

import ErrorIndicator from "../errorIndicator/errorIndicator.component";
import getErrorTable from "../../../helpers/mappers/tabs.mappers/getErrorTable";
import getContentToTab from "../../../helpers/mappers/tabs.mappers/getContentToTab";

import "./body.css";

export const BodyManager = ({specKey}) => {
    const stateObject = useSelector(state => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        errorProfession: state.reducerProfession.errorTable,
        errorDepartment: state.reducerDepartment.errorTable,
        errorPerson: state.reducerPerson.errorTable,
        errorTask: state.reducerTask.errorTable,
        errorEquipmentProperty: state.reducerEquipmentProperty.errorTable,
        errorEquipment: state.reducerEquipment.errorTable,
        errorLogDO: state.reducerLogDO.errorTable,
        errorAnalytic: state.reducerAnalytic.errorTable,
        errorStatistic: state.reducerStatistic.errorTable,
        errorHelp: state.reducerHelp.errorTable,
        errorUser: state.reducerUser.errorTable,
        errorRole: state.reducerRole.errorTable,
        // errorLog: state.reducerLog.errorTable,
    }));

    return <div className="container-dto">
        <Skeleton loading={stateObject.loadingSkeleton} active>
            <Card className={specKey === "logDO" ? "card-dto-logDo" : "card-dto"}>
                {useMemo(() => {
                    const error = getErrorTable(specKey, stateObject);  // Получаем ошибку раздела

                    // Если ошибка в разделе есть, то отрисовываем компонент ErrorIndicator, передавая в него текст ошибки
                    return error
                        ? <ErrorIndicator errorText={error} />
                        : getContentToTab(specKey);
                }, [specKey, stateObject])}
            </Card>
        </Skeleton>
    </div>
};