// Инициализация состояния для раздела "Статистика"
import moment from "moment";
import TabOptions from "../../../options/tab.options/record.options";

const initialState = {
    statisticRating: [],             // Записи вкладки Рейтинг
    statisticList: [],               // Записи вкладки Перечень
    // Дата с ... по ... во вкладке Рейтинг
    dateRating: moment().startOf("month").format(TabOptions.dateFormat) + "/" +
        moment().endOf("month").format(TabOptions.dateFormat),
    // Дата с ... по ... во вкладке Перечень
    dateList: moment().startOf("month").format(TabOptions.dateFormat) + "/" +
        moment().endOf("month").format(TabOptions.dateFormat),
    errorRating: null,      // Ошибка вкладки Рейтинг
    errorList: null,        // Ошибка вкладки Перечень
};

export default initialState;