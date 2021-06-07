// Инициализация общего состояния
const initialState = {
    pageSizeOptions: null,  // Количество записей на странице таблицы
    columnsOptions: {
        professions: null,
        departments: null,
        people: null,
        tasks: null,
        equipmentProperties: null,
        equipment: null,
        logDO: null,
        help: null,
        users: null,
        roles: null,
        statisticRating: null,
        statisticList: null,
        logs: null,
    },  // Отображаемые колонки таблицы
};

export default initialState;