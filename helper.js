// Файл, содержащий функции для изменения полей таблиц
/**
 * Возвращает строку со всеми родителями элемента
 * @param item - элемент
 * @param items - список всех элементов для поиска по коду
 * @returns {string} строка со списком всех родителей
 */
function getNameWithParent(item, items) {
    let retVal = "";

    if (item.parent) {
        if (item.parent.name) {
            // Случай, когда родитель - это объект
            retVal = concat(item.parent.name, retVal);
            retVal = concat(getNameWithParent(item.parent, items), retVal);
        } else {
            //Случай, когда родитель содержит только код
            const parent = items.find(p => p._id.toString() === item.parent.toString());

            if (parent) {
                retVal = concat(parent.name, retVal);
                retVal = concat(getNameWithParent(parent, items), retVal);
            }
        }
    }

    return retVal;
}


/**
 * Соединяет наименование родителя с наименованием элемента
 * @param parent - наименование родителбского элемента
 * @param itemName - наименование элемента
 * @returns {string} - объединённая строка
 */
function concat(parent, itemName) {
    return (parent ? (parent + (parent.endsWith(' \\ ') ? '' : ' \\ ')) : '') + itemName;
}

/**
 * Функция сокращения наименования сотрудника
 * @param name - наименование сотрудника
 * @returns сокращенное наименование сотрудника
 */
function getShortName(name = null) {
    // Сокращаем поле name для только что сохраненной записи
    if (name) {
        const fio = name.split(" ");

        return fio.length === 3
            ? fio[0] + " " + fio[1][0].toUpperCase() + "." + fio[2][0].toUpperCase() + "."
            : name;
    }
}

/**
 * Настройка приложения в зависимости от ролей пользователя
 * @param key - ключ раздела
 * @param user - объект пользователя
 * @returns {{read: boolean, edit: boolean}|Error} - возвращаемое значение (объект{ read, edit} или null)
 */
function checkRoleUser(key, user) {
    const canEdit = (key) => {
        // Массив, содержащий значения возможности редактирования раздела каждой роли для пользователя
        const edit = [], read = [];

        // Массив всех ролей пользователя
        const roles = user && user.roles ? user.roles : null;

        if (roles && roles.length) {
            roles.forEach(role => {
                // Массив всех разрешений роли
                const permissions = role.permissions;

                if (permissions && permissions.length) {
                    const currentSection = permissions.find(perm => perm.key === key);

                    edit.push(currentSection ? currentSection.edit : false);
                    read.push(currentSection ? currentSection.read : false);
                }
            })
        }

        return {
            edit: edit.some(edit => edit),
            read: read.some(read => read)
        };
    }

    // Карта состояний ключей разделов от возможностей редактирования/чтения разделов
    const map = new Map([
        ["professions", canEdit("professions")],
        ["departments", canEdit("departments")],
        ["people", canEdit("people")],
        ["equipment", canEdit("equipment")],
        ["equipmentProperties", canEdit("equipmentProperties")],
        ["tasks", canEdit("tasks")],
        ["logDO", canEdit("logDO")],
        ["help", canEdit("help")],
        ["users", canEdit("users")],
        ["roles", canEdit("roles")],
        ["logs", canEdit("logs")],
        ["analytic", canEdit("analytic")],
        ["statistic", canEdit("statistic")],
        ["profile", canEdit("profile")],
        ["professionItem", canEdit("professions")],
        ["departmentItem", canEdit("departments")],
        ["personItem", canEdit("people")],
        ["equipmentItem", canEdit("equipment")],
        ["equipmentPropertyItem", canEdit("equipmentProperties")],
        ["taskStatusItem", canEdit("tasks")],
        ["logDOItem", canEdit("logDO")],
        ["helpItem", canEdit("help")],
        ["userItem", canEdit("users")],
        ["roleItem", canEdit("roles")],
    ]);

    key = key === "edit-profile" ? "profile" : key;

    if (map.has(key)) {
        return map.get(key);
    }
    else {
        console.log(key);
        return new Error(`Раздел с ключём ${key} не существует (проверка роли пользователя)`);
    }
}

module.exports = {getNameWithParent, getShortName, checkRoleUser};