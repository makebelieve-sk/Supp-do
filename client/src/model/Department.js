// Модель для справочника Подразделение
export class Department {
    constructor({_id, name, notes, parent}) {
        this._id = _id ? _id : null;
        this.name = name ? name : "";
        this.notes = notes ? notes : "";
        this.parent = parent ? parent : null;
    }
}