// Модель для справочника "Журнал действий пользователя"
import moment from "moment";
import TabOptions from "../options/tab.options/record.options/record.options";

export class Log {
    constructor({_id, date, action, username, content}) {
        this._id = _id ? _id : null;
        this.date = date ? moment(date).format(TabOptions.dateFormat) : "";
        this.action = action ? action : "";
        this.username = username ? username : "";
        this.content = content ? content : "";
    }
}