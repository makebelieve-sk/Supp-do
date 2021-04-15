// Модель таблицы "Персонал"
const {getNameWithParent, getShortName} = require("../helper");

class PersonDto {
    constructor(person, departments) {
        this._id = person._id;
        this.name = person.name ? getShortName(person.name) : "";
        this.department = person.department ? person.department.name : "";
        this.profession = person.profession ? person.profession.name : "";
        this.notes = person.notes ? person.notes : "";

        this.departmentTooltip = departments && departments.length && person.department && person.department.parent ?
            getNameWithParent(person.department, departments) + person.department.name : "";
    }
}

module.exports = PersonDto;