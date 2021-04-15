// Модель таблицы "Пользователи"
class UserDto {
    constructor(user) {
        let rolesName = "";

        // Создаем массив наименований ролей
        if (user.roles && user.roles.length) {
            // Сортируем массив в алфавитном порядке
            user.roles.sort((a, b) => a.name < b.name ? -1 : 1);

            // Добавляем наименование роли через запятую
            rolesName = user.roles.map(role => role.name).join("; ");
        }

        this._id = user._id;
        this.userName = user.userName ? user.userName : "";
        this.firstName = user.firstName ? user.firstName : "";
        this.secondName = user.secondName ? user.secondName : "";
        this.roles = user.roles && user.roles.length && rolesName.length ? rolesName : "";
        this.email = user.email ? user.email : "";
        this.approved = !!user.approved;
    }
}

module.exports = UserDto;