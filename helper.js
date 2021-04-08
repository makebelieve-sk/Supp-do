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
            //Случай, когда родитель - это объект
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

        if (fio.length === 3) {
            return fio[0] + " " + fio[1][0].toUpperCase() + "." + fio[2][0].toUpperCase() + ".";
        } else {
            return name;
        }
    }
}

module.exports = {getNameWithParent, getShortName};