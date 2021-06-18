// Определение конструктора таблицы
import {message} from "antd";

import ProfessionTable from "../../../tables/profession";
import LogDOTable from "../../../tables/logDo";
import DepartmentTable from "../../../tables/departments";
import PersonTable from "../../../tables/person";
import EquipmentPropertyTable from "../../../tables/equipmentProperty";
import EquipmentTable from "../../../tables/equipment";
import TaskTable from "../../../tables/task";
import HelpTable from "../../../tables/help";
import RoleTable from "../../../tables/role";
import UserTable from "../../../tables/user";
import StatisticListTable from "../../../tables/statisticList";
import StatisticRatingTable from "../../../tables/statisticRating";
import LogTable from "../../../tables/log";

/**
 * Функция определения конструктора таблицы
 * @param key - ключ выбранного раздела
 */
export default function getTableConstructor(key) {
    // Карта соответствия ключа вкладки и версткой контента вкладки
    const map = new Map([
        ["professions", ProfessionTable],
        ["departments", DepartmentTable],
        ["people", PersonTable],
        ["tasks", TaskTable],
        ["equipmentProperties", EquipmentPropertyTable],
        ["equipment", EquipmentTable],
        ["logDO", LogDOTable],
        ["statisticList", StatisticListTable],
        ["statisticRating", StatisticRatingTable],
        ["help", HelpTable],
        ["users", UserTable],
        ["roles", RoleTable],
        ["logs", LogTable],
    ]);

    if (map.has(key)) {
        return map.get(key);
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (конструктор таблицы)`).then(null);
        return new Error(`Раздел с ключём ${key} не существует (конструктор таблицы)`);
    }
};