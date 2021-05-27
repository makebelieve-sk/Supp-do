// Файл, содержащий функции для поиска записей в таблицах
import filterTableKeys from "../../../options/tab.options/table.options/filterTableKeys";

/**
 * Функция поиска записей в древовидной таблице
 * @param items - массив записей древовидной таблицы
 * @param filterText - строка, введенная пользователем
 * @returns [{item}] - массив отфильтрованных записей
 */
export function filterTreeTable(items, filterText) {
    let itemsToRemove = [];

    if (items && items.length) {
        items.forEach(item => {
            if (item.children && item.children.length) {
                item.children = filterTreeTable(item.children, filterText);
            }

            let noChildren = !item.children || item.children.length === 0;

            if (!item.name.toLowerCase().includes(filterText) && !item.notes.toLowerCase().includes(filterText) && noChildren) {
                itemsToRemove.push(item);
            }
        })
    }

    // Удаляем неподходящие записи из массива записей
    if (itemsToRemove && itemsToRemove.length) {
        itemsToRemove.forEach(item => {
            items.splice(items.indexOf(item), 1);
        });
    }

    return items;
}

/**
 * Функция поиска записей в обычной таблице
 * @param items - массив записей обычной таблицы
 * @param filterText - строка, введенная пользователем
 * @returns [{item}] - массив отфильтрованных записей
 */
export function filterTable(items, filterText) {
    let keys = [];
    let filteredItems = new Set();

    if (items && items.length) {
        // Находим поля объектов записи
        keys = Object.keys(items[0]);

        // Фильтруем нужные для поиска поля
        const filteredDataKeys = filterTableKeys(keys);

        if (filteredDataKeys && filteredDataKeys.length) {
            items.forEach(item => {
                filteredDataKeys.forEach(key => {
                    // Если поле - строка
                    if (item[key] && typeof item[key] === "string" &&
                        item[key].toLowerCase().includes(filterText.toLowerCase())
                    ) {
                        filteredItems.add(item);
                    }
                });
            });
        }
    }

    return Array.from(filteredItems);
}