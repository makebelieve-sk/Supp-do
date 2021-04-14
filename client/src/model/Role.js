// Модель для справочника Роли
export class Role {
    constructor({_id, name, notes, permissions}) {
        this._id = _id ? _id : null;
        this.name = name ? name : "";
        this.notes = notes ? notes : "";
        this.permissions = permissions;
    }
}