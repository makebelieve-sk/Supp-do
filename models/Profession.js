const { Schema, model } = require("mongoose");

// Создаем модель Профессии
const schema = new Schema({
    itemId: { type: String },
    name: { type: String, required: true, unique: true },
    notes: { type: String }
});

module.exports = model('Profession', schema);