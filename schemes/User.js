//Модель для справочника "Пользователь"
const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    userName: {type: String, required: true, unique: true},         // Имя пользователя
    person: {type: Types.ObjectId, ref: "Person"},                  // Сотрудник
    firstName: {type: String, required: true},                      // Имя
    secondName: {type: String, required: true},                     // Фамилия
    email: {type: String},                                          // Почта
    password: {type: String},                                       // Пароль
    mailing: {type: Boolean},                                   // Рассылка новых записей из журнала дефектов и отказов
    approved: {type: Boolean},                                      // Одобрен
    roles: [{type: Types.ObjectId, ref: "Role"}],                   // Роли
});

module.exports = model("User", schema);