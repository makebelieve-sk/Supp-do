const { Schema, model } = require("mongoose");

// Создаем модель Помощь
const schema = new Schema({
    name: {
        label: { type: String },
        value: { type: String }
    },
    text: { type: String },
    date: { type: Date }
});

module.exports = model("Help", schema);