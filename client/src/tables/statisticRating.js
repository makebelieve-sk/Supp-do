// Класс таблицы раздела "Статистика/Рейтинг отказов"
import moment from "moment";

import TableConstructor from "./init";
import store from "../redux/store";
import {goToLogDO} from "../tabs/analytic";
import {ActionCreator} from "../redux/combineActions";
import {StatisticRatingRoute} from "../routes/route.StatisticRating";
import TabOptions from "../options/tab.options/record.options";

export default class StatisticRatingTable extends TableConstructor {
    async onRowClick({row}) {
        await goToLogDO("/rating", {
            satisfies: row.satisfies,
            equipment: row.equipment,
            date: store.getState().reducerStatistic.dateRating
        })
    }

    async onChangeRangePicker(value, dateString) {
        const date = dateString[0] + "/" + dateString[1];

        await StatisticRatingRoute.getAll(date);  // Обновляем записи раздела Статистика

        // Записываем текущий диапазон даты в хранилище
        store.dispatch(ActionCreator.ActionCreatorStatistic.setDateRating(date));
    }

    renderRangePicker(date, dateObject) {
        if (dateObject["rating"]) {
            date = [
                moment(dateObject["rating"].split("/")[0], TabOptions.dateFormat),
                moment(dateObject["rating"].split("/")[1], TabOptions.dateFormat)
            ];
        }

        return super.renderRangePicker(date, this.onChangeRangePicker);
    }
}