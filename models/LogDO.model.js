//Модель для журнала дефектов и отказов
const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    numberLog: {type: String},
    date: {type: String, required: true},
    applicant: {type: Types.ObjectId, ref: "Person", required: true},
    equipment: {type: Types.ObjectId, ref: "Equipment", required: true},
    notes: {type: String, required: true},
    sendEmail: {type: Boolean},
    department: {type: Types.ObjectId, ref: "Department"},
    responsible: {type: Types.ObjectId, ref: "Person"},
    task: {type: String},
    state: {type: Types.ObjectId, ref: "TaskStatus"},
    dateDone: {type: String},
    content: {type: String},
    acceptTask: {type: Types.ObjectId, ref: "Person"},
    files: [{ type: Types.ObjectId, ref: "File" }]
});

module.exports = model("LogDO", schema);