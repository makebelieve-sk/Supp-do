// Схема для справочника "Персонал"
const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    name: {type: String, required: true},                   // Наименование
    notes: {type: String},                                  // Описание
    department: {type: Types.ObjectId, ref: "Department"},  // Подразделение
    profession: {type: Types.ObjectId, ref: "Profession"}   // Профессия
})

module.exports = model("Person", schema);