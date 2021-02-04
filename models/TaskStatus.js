const {Schema, model} = require("mongoose");

// Создаем модель Состояние заявок
const schema = new Schema({
    name: { type: String, required: true, unique: true },
    color: { type: String },
    notes: { type: String },
    isFinish: { type: Boolean }
});

module.exports = model('TaskStatus', schema);