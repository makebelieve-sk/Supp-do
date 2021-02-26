/**
 * Возвращает строку со всеми родителями элемента
 * @param item - элемент
 * @param items - список всех элементов для поиска по коду
 * @returns {string} строка со списком всех родителей
 */
export default function getParents(item, items) {
    let retVal = ""
    if (item.parent) {
        if (item.parent.name) {
            //Случай, когда родитель - это объект
            retVal = concat(item.parent.name, retVal)
            retVal = concat(getParents(item.parent, items), retVal)
        } else {
            //Случай, когда родитель содержит только код
            let parent = items.find(p => p._id === item.parent)

            if (parent) {
                retVal = concat(parent.name, retVal)
                retVal = concat(getParents(parent, items), retVal)
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
    return (parent ? (parent + (parent.endsWith(' \\ ') ? '' : ' \\ ')) : '') + itemName
}