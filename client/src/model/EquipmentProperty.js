// Модель для справочника Характеристики оборудования
export class EquipmentProperty {
    constructor({_id, name, notes}) {
        this._id = _id ? _id : null;
        this.name = name ? name : "";
        this.notes = notes ? notes : "";
    }
}