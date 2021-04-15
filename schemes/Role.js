// Модель для справочника Роли
const {Schema, model} = require("mongoose");

const schema = new Schema({
    name: {type: String, required: true, unique: true}, // Наименование
    notes: {type: String},                              // Описание
    permissions: [
        {
            title: {type: String},
            read: {type: Boolean},
            edit: {type: Boolean},
            key: {type: String}
        }
    ]                                                   // Разрешения
});

module.exports = model("Role", schema);