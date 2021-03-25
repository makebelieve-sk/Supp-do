// Модель таблицы "Журнал дефектов и отказов"
const moment = require("moment");
const {getNameWithParent, getShortName} = require("../helper");

const dateFormat = "DD.MM.YYYY HH:mm";

class LogDoDto {
    constructor(logDo, departments, equipment) {
        this._id = logDo._id;
        this.date = logDo.date ? moment(logDo.date).format(dateFormat) : "";
        this.equipment = logDo.equipment ? logDo.equipment.name : "";
        this.notes = logDo.notes ? logDo.notes : "";
        this.applicant = logDo.applicant ? getShortName(logDo.applicant.name) : "";
        this.responsible = logDo.responsible ? getShortName(logDo.responsible.name) : "";
        this.department = logDo.department ? logDo.department.name : "";
        this.task = logDo.task ? logDo.task : "";
        this.state = logDo.state ? logDo.state.name : "";
        this.dateDone = logDo.dateDone ? moment(logDo.dateDone).format(dateFormat) : "";
        this.planDateDone = logDo.planDateDone ? moment(logDo.planDateDone).format(dateFormat) : "";
        this.content = logDo.content ? logDo.content : "";

        this.equipmentTooltip = equipment && equipment.length ? logDo.equipment && logDo.equipment.parent ?
            getNameWithParent(logDo.equipment, equipment) + logDo.equipment.name : "" : "";

        this.departmentTooltip = departments && departments.length ? logDo.department && logDo.department.parent ?
            getNameWithParent(logDo.department, departments) + logDo.department.name : "" : "";

        this.color = logDo.state ? logDo.state.color : "#FFFFFF";
    }
}

module.exports = LogDoDto;