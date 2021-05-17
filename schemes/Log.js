// Схема для раздела "Журнал действий пользователей"
const { Schema, model } = require("mongoose");

const schema = new Schema({
    date: { type: Date },                // Дата и время
    action: { type: String },            // Действие
    username: { type: String },                        // Пользователь
    content: { type: String },             // Содержание записи
});

module.exports = model("Log", schema);