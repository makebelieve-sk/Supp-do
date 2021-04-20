// Схема для справочника "Перечень оборудования"
const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    name: {type: String, required: true},               // Наименование
    notes: {type: String},                              // Примечание
    parent: {type: Types.ObjectId, ref: "Equipment"},   // Принадлежит
    properties: [
        {
            equipmentProperty: {
                type: Types.ObjectId,
                ref: "EquipmentProperty"
            },
            value: {type: String}
        }
    ],                                                  // Характеристики
    files: [{ type: Types.ObjectId, ref: "File" }]      // Файлы
});

module.exports = model("Equipment", schema);