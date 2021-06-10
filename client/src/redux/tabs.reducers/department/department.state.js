// Инициализация состояния для раздела "Подразеления"
const initialState = {
    departments: [],            // Записи журнала
    rowDataDepartment: null,    // Редактируемая запись
    expandRowsDepartment: [],    // Сворачивание/Развертывание строк таблицы
    errorTableDepartment: null,           // Ошибка в таблице
    errorRecordDepartment: null,          // Ошибка в записи
};

export default initialState;