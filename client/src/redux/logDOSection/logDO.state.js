import moment from "moment";

import TabOptions from "../../options/tab.options/tab.options";

const initialState = {
    // Записи журнала
    logDO: [],
    // Редактируемая запись
    rowDataLogDO: null,
    // Массив файлов
    files: [],
    // Дата с, Дата по
    date: null
};

export default initialState;