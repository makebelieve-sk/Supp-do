// Инициализация состояния для раздела "Характеристики оборудования"
const initialState = {
    equipmentProperties: [],            // Записи раздела
    rowDataEquipmentProperty: null,     // Редактируемая запись
    errorRecord: null,                  // Ошибка в записи
    errorTable: null,                   // Ошибка в таблице
};

export default initialState;