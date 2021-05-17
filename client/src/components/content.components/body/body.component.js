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
        errorProfession: state.reducerProfession.errorTableProfession,
        errorDepartment: state.reducerDepartment.errorTableDepartment,
        errorPerson: state.reducerPerson.errorTablePerson,
        errorTask: state.reducerTask.errorTableTask,
        errorEquipmentProperty: state.reducerEquipmentProperty.errorTableEquipmentProperty,
        errorEquipment: state.reducerEquipment.errorTableEquipment,
        errorLogDO: state.reducerLogDO.errorTableLogDO,
        errorAnalytic: state.reducerAnalytic.errorAnalytic,
        errorRating: state.reducerStatistic.errorRating,
        errorList: state.reducerStatistic.errorList,
        errorChangePassword: state.reducerChangePassword.errorChangePassword,
        errorHelp: state.reducerHelp.errorTableHelp,
        errorUser: state.reducerUser.errorTableUser,
        errorRole: state.reducerRole.errorTableRole,
        errorLog: state.reducerLog.errorTableLog,
    }));

    return <div className="container-dto">
        <Skeleton loading={stateObject.loadingSkeleton} active>
            <Card className={
                specKey === "logDO"
                    ? "card-dto-logDo"
                    : specKey === "changePassword"
                        ? "change-password"
                        : "card-dto"
            }>
                {useMemo(() => {
                    const error = getErrorTable(specKey, stateObject);  // Получаем ошибку раздела

                    // Если ошибка в разделе есть, то отрисовываем компонент ErrorIndicator, передавая в него текст ошибки
                    return error.errorText
                        ? <ErrorIndicator error={error}/>
                        : getContentToTab(specKey);
                }, [specKey, stateObject])}
            </Card>
        </Skeleton>
    </div>
};