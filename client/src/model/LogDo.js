// Модель записи раздела "Журнал дефектов и отказов"
import moment from "moment";
import TabOptions from "../options/tab.options/record.options";
import {getShortNameRecord} from "../helpers/functions/general.functions/replaceField";

export class LogDoRecord {
    constructor(logDoRecord, isNewItem) {
        if (logDoRecord.applicant) logDoRecord.applicant.name = getShortNameRecord(logDoRecord.applicant.name);
        if (logDoRecord.responsible) logDoRecord.responsible.name = getShortNameRecord(logDoRecord.responsible.name);

        this._id = logDoRecord._id;
        this.isNewItem = isNewItem;
        this.date = logDoRecord.date ? moment(logDoRecord.date).format(TabOptions.dateFormat) : "";
        this.equipment = logDoRecord.equipment ? logDoRecord.equipment : null;
        this.notes = logDoRecord.notes ? logDoRecord.notes : "";
        this.applicant = logDoRecord.applicant ? logDoRecord.applicant : null;
        this.responsible = logDoRecord.responsible ? logDoRecord.responsible : null;
        this.department = logDoRecord.department ? logDoRecord.department : null;
        this.task = logDoRecord.task ? logDoRecord.task : "";
        this.taskStatus = logDoRecord.taskStatus ? logDoRecord.taskStatus : null;
        this.dateDone = logDoRecord.dateDone ? moment(logDoRecord.dateDone).format(TabOptions.dateFormat) : "";
        this.planDateDone = logDoRecord.planDateDone ? moment(logDoRecord.planDateDone).format(TabOptions.dateFormat) : "";
        this.content = logDoRecord.content ? logDoRecord.content : "";
        this.sendEmail = logDoRecord.sendEmail;
        this.productionCheck = logDoRecord.productionCheck;
        this.downtime = logDoRecord.downtime ? logDoRecord.downtime : "";
        this.acceptTask = logDoRecord.acceptTask;
        this.files = logDoRecord.files ? logDoRecord.files : [];

        this.applicantId = logDoRecord.applicant && logDoRecord.applicant._id ? logDoRecord.applicant._id : null;
        this.responsibleId = logDoRecord.responsible && logDoRecord.responsible._id ? logDoRecord.responsible._id : null;
        this.departmentId = logDoRecord.department && logDoRecord.department._id ? logDoRecord.department._id : null;
        this.equipmentId = logDoRecord.equipment && logDoRecord.equipment._id ? logDoRecord.equipment._id : null;
        this.taskStatusId = logDoRecord.taskStatus && logDoRecord.taskStatus._id ? logDoRecord.taskStatus._id : null;
    };
}