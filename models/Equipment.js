//Модель для справочника Перечень оборудования
const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    name: {type: String, required: true},
    notes: {type: String},
    parent: {type: Types.ObjectId, ref: 'Equipment'},
    properties: [
        {
            equipmentProperty: {
                type: Types.ObjectId,
                ref: 'EquipmentProperty'
            },
            value: {
                type: String
            },
            id: {
                type: Number
            }
        }
    ]
})

module.exports = model('Equipment', schema);