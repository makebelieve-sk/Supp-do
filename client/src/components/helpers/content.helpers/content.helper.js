// Помощник отображения содержимого вкладки
import {equipmentContent, tabContent} from "../../../options/global.options/global.options";

/*
    loadingSkeleton - спиннер загрузки вкладки
    key - ключ вкладки
 */
export const getContent = (loadingSkeleton, key) => {
    const map = new Map([
        ["professions", tabContent],
        ["departments", tabContent],
        ["people", tabContent],
        ["equipment", equipmentContent],
        ["tasks", tabContent],
        ["equipmentProperties", tabContent],
        ["logDO", tabContent],
    ]);

    if (map.has(key)) {
        return map.get(key)(loadingSkeleton, key);
    }
}