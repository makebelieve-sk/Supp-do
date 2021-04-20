// Схема для справочника "Характеристики оборудования"
const {Schema, model} = require("mongoose");

const schema = new Schema({
    name: { type: String, required: true, unique: true },   // Наименование
    notes: { type: String }                                 // Примечание
});

module.exports = model("EquipmentProperty", schema);