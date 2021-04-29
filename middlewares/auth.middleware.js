const jwt = require("jsonwebtoken");
const User = require("../schemes/User");
const config = require("../config/default.json");
const {checkRoleUser} = require("../helper");

class AuthMiddleware {
    async checkAuth(req, res, next, key) {
        if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

        const token = req.cookies.token;    // Получение токена пользователя

        if (!token) return res.status(401).json({message: "Вы не авторизованы"});

        const decoded = jwt.verify(token, config.jwtSecret);    // Расшифровываем токен

        if (!decoded.userId) return res.status(401).json({message: "Вы не авторизованы"});

        // Если время жизни куки истекло, нужно перенаправить пользователя на страницу /login
        if (!decoded.iat || !decoded.exp) return res.status(403).json({message: "Время жизни куки истекло"});

        // Находим текущего пользователя с ролями
        const user = await User.findById({_id: decoded.userId}).populate("roles").select("roles");

        if (!user) return res.status(400).json({message: "Такого пользователя не существует"});

        if (user.roles && user.roles.length) {
            const accessRead = checkRoleUser(key, user).read;
            if (!accessRead) return res.status(400).json({message: "У Вас нет прав для просмотра данного раздела"});

            next();
        } else {
            return res.status(400).json({message: "У Вас нет прав для просмотра данного раздела"});
        }
    }
}

module.exports = new AuthMiddleware();