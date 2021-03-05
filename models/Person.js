//Модель для справочника Персонал
const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    isCreated: {type: Boolean},
    tabNumber: {type: Number},
    name: {type: String, required: true},
    notes: {type: String},
    department: {type: Types.ObjectId, ref: 'Department'},
    profession: {type: Types.ObjectId, ref: 'Profession'}
})

module.exports = model('Person', schema)