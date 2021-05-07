// Раздел "Статистика"
import React from "react";
import {useSelector} from "react-redux";

import ErrorIndicator from "../errorIndicator/errorIndicator.component";

import "./statistic.css";

export const StatisticComponent = () => {
    const {error} = useSelector(state => ({
        error: state.reducerStatistic.error
    }));

    if (error) return <ErrorIndicator errorText={error} />

    return (
        <div>Statistic Tab!!</div>
    )
}