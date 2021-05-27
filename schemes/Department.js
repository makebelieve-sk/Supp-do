// Схема для справочника "Подразделения"
const {Schema, model, Types} = require("mongoose")

const schema = new Schema({
    name: {type: String, required: true},               // Наименование
    notes: {type: String},                              // Примечание
    parent: {type: Types.ObjectId, ref: "Department"}   // Принадлежит
})

module.exports = model("Department", schema)