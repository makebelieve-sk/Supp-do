// Модель для загружаемых файлов
const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    url: {type: String, required: true},
    status: {type: String, required: true},
    uid: {type: String, required: true}
})

module.exports = model('File', schema);