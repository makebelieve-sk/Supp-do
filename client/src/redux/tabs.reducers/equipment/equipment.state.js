// Инициализация состояния для раздела "Оборудование"
const initialState = {
    equipment: [],              // Список с перечнем оборудования
    rowDataEquipment: null,     // Редактируемая запись
    selectsArray: [],           // Массив строчек вкладки "Характеристики"
    files: [],                  // Массив файлов
    errorRecordEquipment: null,          // Ошибка в записи
    errorTableEquipment: null,           // Ошибка в таблице
};

export default initialState;