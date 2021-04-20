// Настройка приложения в зависимости от ролей пользователя
import {message} from "antd";

export const checkRoleUser = (key, user) => {
    const canEdit = (key) => {
        // Массив, содержащий значения возможности редактирования раздела каждой роли для пользователя
        const edit = [], read = [];

        // Массив всех ролей пользователя
        const roles = user ? user.user.roles : null;

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
        ["statistic", canEdit("statistic")]
    ]);

    if (key === "userManagement" || key === "personal-area" || key === "analytic-section" || key === "directory" ||
        key === "personManagement" || key === "equipmentKey") return null;

    if (map.has(key)) {
        return map.get(key);
    } else {
        console.log(key);
        message.error(`Раздел с ключём ${key} не существует (проверка роли пользователя)`).then(null);
        return null;
    }
}