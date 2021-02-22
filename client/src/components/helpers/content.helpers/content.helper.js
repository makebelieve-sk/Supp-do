// Помощник отображения содержимого вкладки
import store from "../../../redux/store";

import {departmentsContent, equipmentContent, tabContent} from "../../../options/global.options/global.options";

/*
    loadingSkeleton - спиннер загрузки вкладки
    key - ключ вкладки
 */
export const getContent = (loadingSkeleton, key) => {
    const departments = store.getState().reducerDepartment.departments;
    const equipment = store.getState().reducerEquipment.equipment;

    const map = new Map([
        ["professions", {content: tabContent}],
        ["departments", {content: departmentsContent, dataStore: departments}],
        ["people", {content: tabContent}],
        ["equipment", {content: equipmentContent, dataStore: equipment}],
        ["tasks", {content: tabContent}],
        ["equipmentProperties", {content: tabContent}],
        ["logDO", {content: tabContent}],
    ]);

    if (map.has(key)) {
        return map.get(key).content(loadingSkeleton, key, map.get(key).dataStore);
    }
}