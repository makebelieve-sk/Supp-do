// Схема для справочника "Профессии"
const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: { type: String, required: true, unique: true },   // Наименование
    notes: { type: String }                                 // Описание
});

module.exports = model("Profession", schema);