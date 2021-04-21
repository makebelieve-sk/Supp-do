// Инициализация состояния для раздела "Оборудование"
const initialState = {
    equipment: [],              // Список с перечнем оборудования
    rowDataEquipment: null,     // Редактируемая запись
    selectsArray: [],           // Массив строчек вкладки "Характеристики"
    files: [],                  // Массив файлов
    errorRecord: null,          // Ошибка в записи
    errorTable: null,           // Ошибка в таблице
};

export default initialState;