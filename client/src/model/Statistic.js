// Модель для справочника Роли
export class Statistic {
    constructor({_id, rating, list}) {
        this._id = _id;
        this.rating = rating;
        this.list = list;
    }
}