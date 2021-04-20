// Схема для справочника "Состояние заявки"
const {Schema, model} = require("mongoose");

const schema = new Schema({
    name: { type: String, required: true, unique: true },   // Наименование
    color: { type: String },                                // Цвет
    notes: { type: String },                                // Описание
    isFinish: { type: Boolean }                             // Завершено
});

module.exports = model("TaskStatus", schema);