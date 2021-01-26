const {Schema, model} = require("mongoose");

// Создаем модель Профессии
const schema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = model('User', schema);