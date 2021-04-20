// Схема для загружаемых файлов
const {Schema, model} = require("mongoose");

const schema = new Schema({
    name: {type: String, required: true},       // имя файла
    url: {type: String, required: true},        // юрл файла
    status: {type: String, required: true},     // статус файла
    uid: {type: String, required: true},        // идентификатор файла
    originUid: {type: String, required: true}   // исходный идентификатор файла
})

module.exports = model("File", schema);