// Файл отправки sms уведомлений
const moment = require("moment");
const request = require("request");

const User = require("../schemes/User");
const config = require("./config.json");

const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

/**
 * Функция отправки SMS уведомления
 * req - объект запроса сервера
 * res - объект ответа сервера
 */
const sendingSms = async (req, res) => {
    const {date, equipment} = req.body;

    const sendUsers = await User.find({$and: [{sms: true}, {phone: {$ne: null}}]}).select("phone");

    let phones = [];   // Массив с номерами телефонов пользователей

    if (sendUsers && sendUsers.length) {
        sendUsers.forEach(user => {
            phones.push(user.phone);
        });

        const message = `Запись журнала дефектов и отказов от ${moment(date).format(dateFormat)}.\nОборудование: ${equipment ? equipment.name : "не указано"}`;

        const url = `${config.smsDomen}api_id=${config.smsId}&to=${phones.join(",")}&msg=Test&json=1`;
        console.log(url);
        console.log(message);
        // request(
        //     url,
        //     (err) => {
        //         if (err) {
        //             console.log("Произошла ошибка при отправке СМС на номер: " + err);
        //             res.status(500).json({message: `Произошла ошибка при отправке СМС на номера ${phones.join(", ")}: ${err}`});
        //         }
        //
        //         console.log("СМС на номер успешно отправлен");
        //     }
        // )
    }
}

module.exports = sendingSms;