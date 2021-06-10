// Инициализация состояния для раздела "Оборудование"
const initialState = {
    equipment: [],              // Список с перечнем оборудования
    rowDataEquipment: null,     // Редактируемая запись
    expandRowsEquipment: [],    // Сворачивание/Развертывание строк таблицы
    selectsArray: [],           // Массив строчек вкладки "Характеристики"
    files: [],                  // Массив файлов
    errorRecordEquipment: null,          // Ошибка в записи
    errorTableEquipment: null,           // Ошибка в таблице
};

export default initialState;