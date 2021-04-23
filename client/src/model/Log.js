// Модель для справочника Журнал действий пользователя
export class Help {
    constructor({_id, name, text, date}) {
        this._id = _id ? _id : null;
        this.name = name ? name : null;
        this.text = text ? text : "";
        this.date = date ? date : null;
    }
}