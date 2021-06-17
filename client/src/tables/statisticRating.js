// Класс таблицы раздела "Статистика/Рейтинг отказов"
import TableConstructor from "./init";
import store from "../redux/store";
import {goToLogDO} from "../tabs/analytic";

export default class StatisticRatingTable extends TableConstructor {
    async onRowClick({row}) {
        await goToLogDO("/rating", {
            satisfies: row.satisfies,
            equipment: row.equipment,
            date: store.getState().reducerStatistic.dateRating
        })
    }
}