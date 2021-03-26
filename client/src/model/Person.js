// Модель для справочника Персонал
export class Person {
    constructor({_id, name, notes, department, profession}) {
        this._id = _id ? _id : null;
        this.name = name ? name : "";
        this.department = department ? department : null;
        this.profession = profession ? profession : null;
        this.notes = notes ? notes : "";
    }
}