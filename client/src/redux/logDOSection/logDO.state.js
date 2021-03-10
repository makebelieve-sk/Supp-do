import moment from "moment";
import TabOptions from "../../options/tab.options/tab.options";

const initialState = {
    // Записи журнала
    logDO: [],
    // Редактируемая запись
    rowDataLogDO: null,
    // Массив файлов
    files: [],
    // Дата с ... по ...
    date: moment().startOf("month").format(TabOptions.dateFormat) + "/" +
        moment().endOf("month").format(TabOptions.dateFormat)
};

export default initialState;