// Модель для справочника Характеристики оборудования
const {Schema, model} = require("mongoose");

// Создаем модель Характеристики оборудования
const schema = new Schema({
    name: { type: String, required: true, unique: true },
    notes: { type: String }
});

module.exports = model('EquipmentProperty', schema);