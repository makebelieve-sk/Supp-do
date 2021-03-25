// Файл, содержащий функции для изменения полей записей
/**
 * Возвращает строку со всеми родителями элемента
 * @param item - элемент
 * @param items - список всех элементов для поиска по коду
 * @returns {string} строка со списком всех родителей
 */
function getParents(item, items) {
    let retVal = "";

    if (item.parent) {
        if (item.parent.name) {
            //Случай, когда родитель - это объект
            retVal = concat(item.parent.name, retVal);
            retVal = concat(getParents(item.parent, items), retVal);
        } else {
            //Случай, когда родитель содержит только код
            const parent = items.find(p => p._id === item.parent);

            if (parent) {
                retVal = concat(parent.name, retVal);
                retVal = concat(getParents(parent, items), retVal);
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
 * Функция изменения поля name
 * @param people - массив записей персонала
 * @returns измененный массив записей
 */
function getShortName(people = []) {
    // Изменяем поле name для каждой записи в массиве
    return people && people.length ? people.map(person => helper(person.name)) : [];
}

/**
 * Функция изменения поля name
 * @param name - запись персонала
 * @returns измененный объект записи
 */
function getShortNameRecord(name = null) {
    // Изменяем поле name для только что сохраненной записи
    return name ? helper(name) : "";
}

/**
 * Функция помощник для сокращения поля name
 * @param name - объект записи
 * @returns измененный объект записи
 */
const helper = (name) => {
    const fio = name.split(" ");
    let retVal = fio[0];

    if (fio[1]) {
        retVal += " " + fio[1][0].toUpperCase() + ".";
    }

    if (fio[2]) {
        retVal += " " + fio[2][0].toUpperCase() + ".";
    }

    return retVal[0].toUpperCase() + retVal.slice(1);
}

export {getParents, getShortName, getShortNameRecord};