// Схема для раздела "Помощь"
const { Schema, model } = require("mongoose");

const schema = new Schema({
    name: {
        label: { type: String },
        value: { type: String }
    },                                  // Название раздела
    text: { type: String },             // Описание
    date: { type: Date }                // Дата изменения
});

module.exports = model("Help", schema);