// Файл отправки email уведомлений
const moment = require("moment");
const nodemailer = require("nodemailer");

const User = require("../schemes/User");
const config = require("./config.json");

const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Создаем транспорт
const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    auth: {
        user: config.mailLogin,
        pass: config.mailPassword
    }
});

/**
 * Функция отправки письма на почту
 * req - объект запроса сервера
 * res - объект ответа сервера
 */
const sendingEmail = async (req, res) => {
    const {date, notes, equipment, applicant} = req.body;

    const sendUsers = await User.find({$and: [{mailing: true}, {email: {$ne: null}}]}).select("email");

    let mailAddresses = [];   // Массив с почтами пользователей

    if (sendUsers && sendUsers.length) {
        sendUsers.forEach(user => {
            mailAddresses.push(user.email);
        });

        // Тема сообщения
        const subject = "СУПП-ДО: Новая запись в Журнале дефектов и отказов от " + moment(date).format(dateFormat);
        // Тело сообщения
        const html = `<b>Оборудование:</b> ${equipment ? equipment.name : "не указано"}<br/><b>Описание заявки:</b> ${notes}<br/><b>Заявитель:</b> ${applicant ? applicant.name : "не указано"}`;

        // Отправляем письма на указанные почты
        // Создаем объект сообщения
        const mailOptions = {
            from: config.mailLogin,
            to: mailAddresses,
            subject,
            html
        };

        // Отправляем письмо
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                res.status(500).json({
                    message: `Произошла ошибка при отправке email уведомления на электронные адреса: ${mailAddresses.join(" ")}: ${error})}`
                });
            } else {
                console.log("Письмо отправлено: " + info.response);
            }
        });
    }
}

module.exports = sendingEmail;