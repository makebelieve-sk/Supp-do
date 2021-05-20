// Файл отправки sms уведомлений
const moment = require("moment");
const SMSru = require("sms_ru");

const User = require("../schemes/User");
const config = require("./config.json");

const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

const sms = new SMSru(config.smsId);

/**
 * Функция отправки SMS уведомления
 * req - объект запроса сервера
 * res - объект ответа сервера
 */
const sendingSms = async (req, res) => {
    const {date, notes, equipment} = req.body;

    const sendUsers = await User.find({$and: [{sms: true}, {phone: {$ne: null}}]}).select("phone");

    let phones = [];   // Массив с номерами телефонов пользователей

    if (sendUsers && sendUsers.length) {
        sendUsers.forEach(user => {
            phones.push(user.phone);
        });

        const message = `Новая запись ЖДО от ${moment(date).format(dateFormat)}.\n${equipment ? "Оборудование: " + equipment.name : ""}. ${notes}`;

        sms.sms_send({
            to: phones.join(","),
            text: message
        }, function(e){
            console.log(e.description);
        });
    }
}

module.exports = sendingSms;