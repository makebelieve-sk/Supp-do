// Инициализация состояния для раздела "Состояние заявок"
const initialState = {
    tasks: [],              // Записи журнала
    rowDataTask: null,      // Редактируемая запись
    errorRecord: null,      // Ошибка в записи
    errorTable: null,       // Ошибка в таблице
};

export default initialState;