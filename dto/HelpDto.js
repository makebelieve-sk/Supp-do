// Модель таблицы "Помощь"
const moment = require("moment");

class HelpDto {
    constructor(help) {
        this._id = help._id;
        this.name = help.name && help.name.label ? help.name.label : "";
        this.text = help.text;
        this.date = help.date ? moment(help.date).format("DD.MM.YYYY HH:mm") : "";
    };
}

module.exports = HelpDto;