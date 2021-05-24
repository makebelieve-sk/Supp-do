// Модель для справочника Пользователи
import {getShortNameRecord} from "../helpers/functions/general.functions/replaceField";

export class User {
    constructor({_id, userName, person, firstName, secondName, email, phone, mailing, sms, approved, roles, typeMenu}) {
        if (person) person.name = getShortNameRecord(person.name);

        this._id = _id;
        this.userName = userName ? userName : "";
        this.person = person ? person : null;
        this.firstName = firstName ? firstName : "";
        this.secondName = secondName ? secondName : "";
        this.email = email ? email : "";
        this.phone = phone ? phone : "";
        this.mailing = mailing;
        this.sms = sms;
        this.approved = approved;
        this.roles = roles;
        this.typeMenu = typeMenu ? typeMenu : [{label: "Слева", value: "left"}, {label: "Сверху", value: "top"}];
    }
}