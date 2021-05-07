// Исходный массив разрешений
const permissions = [
    {title: "Профессии", read: false, edit: false, key: "professions"},
    {title: "Подразделения", read: false, edit: false, key: "departments"},
    {title: "Персонал", read: false, edit: false, key: "people"},
    {title: "Перечень оборудования", read: false, edit: false, key: "equipment"},
    {title: "Характеристики оборудования", read: false, edit: false, key: "equipmentProperties"},
    {title: "Состояния заявок", read: false, edit: false, key: "tasks"},
    {title: "Журнал дефектов и отказов", read: true, edit: true, key: "logDO"},
    {title: "Помощь", read: false, edit: false, key: "help"},
    {title: "Пользователи", read: false, edit: false, key: "users"},
    {title: "Роли", read: false, edit: false, key: "roles"},
    {title: "Журнал действий пользователей", read: false, edit: false, key: "logs"},
    {title: "Аналитика", read: false, edit: false, key: "analytic"},
    {title: "Статистика", read: false, edit: false, key: "statistic"},
    {title: "Принятие работы", read: false, edit: false, key: "acceptTask"},
];

// Создаем массив разрешений для роли "Администратор"
const permissionsAdmin = [
    {title: "Профессии", read: true, edit: true, key: "professions"},
    {title: "Подразделения", read: true, edit: true, key: "departments"},
    {title: "Персонал", read: true, edit: true, key: "people"},
    {title: "Перечень оборудования", read: true, edit: true, key: "equipment"},
    {title: "Характеристики оборудования", read: true, edit: true, key: "equipmentProperties"},
    {title: "Состояния заявок", read: true, edit: true, key: "tasks"},
    {title: "Журнал дефектов и отказов", read: true, edit: true, key: "logDO"},
    {title: "Помощь", read: true, edit: true, key: "help"},
    {title: "Пользователи", read: true, edit: true, key: "users"},
    {title: "Роли", read: true, edit: true, key: "roles"},
    {title: "Журнал действий пользователей", read: true, edit: false, key: "logs"},
    {title: "Аналитика", read: true, edit: false, key: "analytic"},
    {title: "Статистика", read: true, edit: false, key: "statistic"},
    {title: "Принятие работы", read: false, edit: true, key: "acceptTask"},
];

module.exports = {permissions, permissionsAdmin};