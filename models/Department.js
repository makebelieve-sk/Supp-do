//Модель для справочника Подразделения
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    isCreated: {type: Boolean},
    name: {type: String, required: true, unique: true},
    notes: {type: String},
    parent: {type: Types.ObjectId, ref: 'Department'}
})

module.exports = model('Department', schema)