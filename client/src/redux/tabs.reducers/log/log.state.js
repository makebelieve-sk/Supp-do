// Инициализация состояния для раздела "Журнал действий пользователя"
import moment from "moment";
import TabOptions from "../../../options/tab.options/record.options/record.options";

const initialState = {
    logs: [],               // Записи раздела
    rowDataLog: null,      // Редактируемая запись
    // Дата с ... по ...
    dateLog: moment().startOf("month").format(TabOptions.dateFormat) + "/" +
        moment().endOf("month").format(TabOptions.dateFormat),
    errorRecordLog: null,      // Ошибка в записи
    errorTableLog: null,       // Ошибка в таблице
};

export default initialState;