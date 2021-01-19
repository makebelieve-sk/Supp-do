//Модель для справочника Подразделения
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    notes: {type: String},
    parent: {type: Types.ObjectId, ref: 'Department'}
})

module.exports = model('Department', schema)