// Милдар, проверяющий аутентификацию пользователя, контролирует просмотр и изменение разделов согласно ролям пользователя
const jwt = require("jsonwebtoken");

const User = require("../schemes/User");
const config = require("../config/default.json");
const {checkRoleUser} = require("../helper");

class AuthMiddleware {
    async checkAuth(req, res, next) {
        try {
            const method = req.method;

            const url = req.url
                .replace("/api", "")
                .replace("/directory", "")
                .replace("/analytic", "")
                .replace("/admin", "")
                .split("/")[1];

            if (!method) return res.status(500).json({message: "Http метод не распознан"});
            if (!url) return res.status(500).json({message: "Неверно указан url-адрес", body: req.url});
            if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

            const token = req.cookies.token;    // Получение токена пользователя

            if (!token) return res.status(401).json({message: "Вы не авторизованы"});

            let decoded;

            try {
                decoded = jwt.verify(token, config.jwtSecret);    // Расшифровываем токен

                if (!decoded.userId) return res.status(401).json({message: "Вы не авторизованы"});
            } catch (e) {
                console.log(e);
                return res.status(401).json({message: "Время жизни токена истекло"});
            }

            // Проверяем юрл, в двух случаях нужно только проверить авторизирован ли пользователь
            if (url !== "upload" || req.url.slice(0, 10) !== "/help/get/") {
                // Находим текущего пользователя с ролями
                const user = await User.findById({_id: decoded.userId}).populate("roles").select("roles");

                if (!user) return res.status(403).json({message: "Такого пользователя не существует"});

                if (user.roles && user.roles.length) {
                    const access = method === "GET" ? checkRoleUser(url, user).read : checkRoleUser(url, user).edit;
                    const accessAction = method === "GET" ? "просмотра" : "редактирования";

                    if (!access) return res.status(403).json({message: `У Вас нет прав для ${accessAction} данного раздела`});

                    next();
                } else {
                    return res.status(403).json({message: "У Вас нет прав для взаимодействия с разделом"});
                }
            } else {
                next();
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Произошла ошибка при проверке аутентификации пользователя"});
        }
    };
}

module.exports = new AuthMiddleware();