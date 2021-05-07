// Глобальные настройки приложения
// Инициализация массива существующих разделов проекта
const sections = [
    {label: "Не выбрано", value: null},
    {label: "Профессии", value: "professions"},
    {label: "Подразделения", value: "departments"},
    {label: "Персонал", value: "people"},
    {label: "Характеристики оборудования", value: "equipmentProperties"},
    {label: "Оборудование", value: "equipment"},
    {label: "Состояние заявок", value: "tasks"},
    {label: "Журнал дефектов и отказов", value: "logDO"},
    {label: "Аналитика", value: "analytic"},
    {label: "Статистика", value: "statistic"},
    {label: "Помощь", value: "help"},
    {label: "Пользователи", value: "users"},
    {label: "Роли", value: "roles"},
    {label: "Журнал действий пользователя", value: "logs"},
    {label: "Информация о предприятии", value: "companiesInfo"},
]

/**
 * Функция фильтрации полей массива данных
 * @param data - массив данных
 * @returns массив данных с отфильтрованными полями
 */
const getFilteredData = (data) => {
    return data.filter(key => {
        return key !== "_id" && key !== "key" && key !== "__v" && key !== "files" &&
            key !== "sendEmail" && key !== "productionCheck" && key !== "downtime" && key !== "acceptTask" &&
            key !== "equipmentTooltip" && key !== "departmentTooltip" && key !== "color" && key !== "departmentId" &&
            key !== "equipmentId" && key !== "mailing" && key !== "password" &&
            key !== "permissions";
    });
}

/**
 * Функция фильтрации полей массива данных для печати
 * @param data - массив данных
 * @returns массив данных с отфильтрованными полями
 */
const getPrintFilteredData = (data) => {
    return data.filter(key => {
        return key !== "_id" && key !== "key" && key !== "__v" && key !== "files" &&
            key !== "sendEmail" && key !== "productionCheck" && key !== "downtime" && key !== "acceptTask" &&
            key !== "equipmentTooltip" && key !== "departmentTooltip" && key !== "color" && key !== "departmentId" &&
            key !== "equipmentId" && key !== "parent" && key !== "properties" && key !== "nameWithParent";
    });
}

export {sections, getFilteredData, getPrintFilteredData};