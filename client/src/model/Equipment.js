// Модель для справочника Оборудование
export class Equipment {
    constructor({_id, name, notes, parent, properties, files}) {
        this._id = _id ? _id : null;
        this.name = name ? name : "";
        this.notes = notes ? notes : "";
        this.parent = parent ? parent : null;
        this.properties = properties ? properties : [];
        this.files = files ? files : [];
    }
}