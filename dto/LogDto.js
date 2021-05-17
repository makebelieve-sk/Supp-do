// Модель таблицы "Журнал действий пользователей"
const moment = require("moment");

class LogDto {
    constructor(log) {
        this._id = log._id;
        this.date = log.date ? moment(log.date).format("DD.MM.YYYY HH:mm") : "";
        this.action = log.action;
        this.username = log.username;
        this.content = log.content;
    };
}

module.exports = LogDto;