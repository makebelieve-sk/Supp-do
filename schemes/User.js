//Модель для справочника Пользователь
const {Schema, model, Types} = require("mongoose");

const schema = new Schema({
    name: {type: String, required: true},
    surName: {type: String, required: true},
    email: {type: String},
    mailing: {type: Boolean},
    approved: {type: Boolean},
    roleAdmin: {type: Boolean},
    roleUser: {type: Boolean},
    userName: {type: String, required: true},
    person: {type: Types.ObjectId, ref: "Person", required: true}
});

module.exports = model("User", schema);