// Модель для справочника Журнал дефектов и отказов
import moment from "moment";
import TabOptions from "../options/tab.options/tab.options";

export class LogDO {
    constructor({_id, date, applicant, equipment, notes, sendEmail, productionCheck, department, responsible, task,
                    state, dateDone, planDateDone, content, downtime, acceptTask, files}) {
        this._id = _id ? _id : null;
        this.date = date ? date : moment().format(TabOptions.dateFormat);
        this.applicant = applicant ? applicant : null;
        this.equipment = equipment ? equipment : null;
        this.notes = notes ? notes : "";
        this.sendEmail = sendEmail ? sendEmail : false;
        this.productionCheck = productionCheck ? productionCheck : false;
        this.department = department ? department : null;
        this.responsible = responsible ? responsible : null;
        this.task = task ? task : "";
        this.state = state ? state : null;
        this.dateDone = dateDone ? dateDone : null;
        this.planDateDone = planDateDone ? planDateDone : null;
        this.content = content ? content : "";
        this.downtime = downtime ? downtime : null;
        this.acceptTask = acceptTask ? acceptTask : false;
        this.files = files ? files : [];
    };
}