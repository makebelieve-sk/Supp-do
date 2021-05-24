// Инициализация состояния для раздела "Журнал дефектов и отказов"
import moment from "moment";
import TabOptions from "../../../options/tab.options/record.options";

const initialState = {
    logDO: [],              // Записи журнала
    rowDataLogDO: null,     // Редактируемая запись
    files: [],              // Массив файлов
    // Дата с ... по ...
    date: moment().startOf("month").format(TabOptions.dateFormat) + "/" +
        moment().endOf("month").format(TabOptions.dateFormat),
    legend: null,           // Легенда статусов
    // Блок, появляющийся после перехода в таблицу ЖДО с Аналитики
    alert: {
        alert: null,
        filter: null,
        url: null
    },
    errorRecordLogDO: null,      // Ошибка в записи
    errorTableLogDO: null,       // Ошибка в таблице
};

export default initialState;