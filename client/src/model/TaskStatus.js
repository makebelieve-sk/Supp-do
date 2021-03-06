// Модель для справочника Состояние заявки
export class TaskStatus {
    constructor({_id, name, color, notes, isFinish}) {
        this._id = _id ? _id : null;
        this.name = name ? name : "";
        this.color = color ? color : "#FFFFFF";
        this.notes = notes ? notes : "";
        this.isFinish = isFinish ? isFinish : false;
    }
}