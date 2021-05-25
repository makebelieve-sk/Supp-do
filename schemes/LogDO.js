//Модель для раздела "Журнал дефектов и отказов"
const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    date: {type: Date, required: true},                // Дата заявки
    applicant: {type: Types.ObjectId, ref: "Person", required: true},       // Заявитель
    equipment: {type: Types.ObjectId, ref: "Equipment", required: true},    // Оборудование
    notes: {type: String, required: true},              // Описание
    sendEmail: {type: Boolean},                         // Оперативное уведомление ответственных специалистов
    productionCheck: {type: Boolean},                   // Производство остановлено
    department: {type: Types.ObjectId, ref: "Department"},     // Подразделение
    responsible: {type: Types.ObjectId, ref: "Person"},        // Ответственный
    task: {type: String},                               // Задание
    taskStatus: {type: Types.ObjectId, ref: "TaskStatus"},   // Состояние
    dateDone: {type: Date},                              // Дата выполнения
    planDateDone: {type: Date},                          // Плаовая дата выполнения
    content: {type: String},                             // Содержание работ
    downtime: {type: String},                            // Время простоя, мин
    acceptTask: {type: Boolean},                         // Работа принята
    files: [{ type: Types.ObjectId, ref: "File" }],      // Файлы
    chooseResponsibleTime: {type: Number},               // Количество миллисекунд, когда был выбран ответственный
    chooseStateTime: {type: Number}                      // Количество миллисекунд, когда был выбран статус заявки
});

module.exports = model("LogDO", schema);