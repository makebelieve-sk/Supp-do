/**
 * Функция фильтрации неиспользуемых полей данных таблицы
 * @param keys - массив ключей таблицы
 * @returns string[] - отфильтрованный массив ключей таблицы
 */
export default function filterTableKeys (keys) {
    return keys.filter(key => key !== "_id" && key !== "key" && key !== "__v" && key !== "files" &&
        key !== "sendEmail" && key !== "productionCheck" && key !== "downtime" && key !== "acceptTask" &&
        key !== "equipmentTooltip" && key !== "departmentTooltip" && key !== "color" && key !== "departmentId" &&
        key !== "equipmentId" && key !== "mailing" && key !== "password" && key !== "permissions" &&
        key !== "properties" && key !== "nameWithParent" && key !== "dateDone" && key !== "content" &&
        key !== "chooseResponsibleTime" && key !== "chooseStateTime" && key !== "satisfies" && key !== "textParser");
};