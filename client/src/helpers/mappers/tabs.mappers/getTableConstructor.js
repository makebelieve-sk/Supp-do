// Определение конструктора таблицы
import {message} from "antd";

import ProfessionTable from "../../../tables/ProfessionTable";
import LogDOTable from "../../../tables/LogDoTable";
import DepartmentTable from "../../../tables/DepartmentTable";
import PersonTable from "../../../tables/PersonTable";
import EquipmentPropertyTable from "../../../tables/EquipmentPropertyTable";
import EquipmentTable from "../../../tables/EquipmentTable";
import TaskTable from "../../../tables/TaskTable";
import HelpTable from "../../../tables/HelpTable";
import RoleTable from "../../../tables/RoleTable";
import UserTable from "../../../tables/UserTable";
import StatisticListTable from "../../../tables/StatisticListTable";
import StatisticRatingTable from "../../../tables/StatisticRatingTable";
import LogTable from "../../../tables/LogTable";

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