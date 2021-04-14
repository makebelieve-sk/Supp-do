// Модель для справочника Пользователи
export class User {
    constructor({_id, userName, person, name, surName, email, mailing, approved, roleAdmin, roleUser}) {
        this._id = _id ? _id : null;
        this.userName = userName ? userName : "";
        this.person = person ? person : null;
        this.name = name ? name : "";
        this.surName = surName ? surName : "";
        this.email = email ? email : "";
        this.mailing = mailing;
        this.approved = approved;
        this.roleAdmin = roleAdmin;
        this.roleUser = roleUser;
    }
}