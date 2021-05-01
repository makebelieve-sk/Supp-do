// Милдар, проверяющий аутентификацию пользователя
const jwt = require("jsonwebtoken");

const User = require("../schemes/User");
const config = require("../config/default.json");
const {checkRoleUser} = require("../helper");

class AuthMiddleware {
    async canRead(req, res, next, key) {
        try {
            if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

            const token = req.cookies.token;    // Получение токена пользователя

            if (!token) return res.status(401).json({message: "Вы не авторизованы"});

            let decoded;

            try {
                decoded = jwt.verify(token, config.jwtSecret);    // Расшифровываем токен

                if (!decoded.userId) return res.status(401).json({message: "Вы не авторизованы"});

                // Если время жизни куки истекло, нужно перенаправить пользователя на страницу /login или обновить jwt токен refresh токеном
                if (!decoded.iat || !decoded.exp) return res.status(401).json({message: "Время жизни токена истекло"});
            } catch (e) {
                console.log(e);
                return res.status(401).json({message: "Время жизни токена истекло"})
            }

            // Находим текущего пользователя с ролями
            const user = await User.findById({_id: decoded.userId}).populate("roles").select("roles");

            if (!user) return res.status(403).json({message: "Такого пользователя не существует"});

            if (user.roles && user.roles.length) {
                const accessRead = checkRoleUser(key, user).read;
                if (!accessRead) return res.status(403).json({message: "У Вас нет прав для просмотра данного раздела"});

                next();
            } else {
                return res.status(403).json({message: "У Вас нет прав для просмотра данного раздела"});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Произошла ошибка при проверке возможности просмотра данного раздела пользователем"});
        }
    };

    async canEdit(req, res, next, key) {
        try {
            if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

            const token = req.cookies.token;    // Получение токена пользователя

            if (!token) return res.status(401).json({message: "Вы не авторизованы"});

            let decoded;

            try {
                decoded = jwt.verify(token, config.jwtSecret);    // Расшифровываем токен

                if (!decoded.userId) return res.status(401).json({message: "Вы не авторизованы"});

                // Если время жизни куки истекло, нужно перенаправить пользователя на страницу /login или обновить jwt токен refresh токеном
                if (!decoded.iat || !decoded.exp) return res.status(401).json({message: "Время жизни токена истекло"});
            } catch (e) {
                console.log(e);
                return res.status(401).json({message: "Время жизни токена истекло"})
            }

            // Находим текущего пользователя с ролями
            const user = await User.findById({_id: decoded.userId}).populate("roles").select("roles");

            if (!user) return res.status(403).json({message: "Такого пользователя не существует"});

            if (user.roles && user.roles.length) {
                const accessEdit = checkRoleUser(key, user).edit;
                if (!accessEdit) return res.status(403).json({message: "У Вас нет прав для редактирования данного раздела"});

                next();
            } else {
                return res.status(403).json({message: "У Вас нет прав для редактирования данного раздела"});
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Произошла ошибка при проверке возможности редактирования данного раздела пользователем"});
        }
    };

    async checkAuth(req, res) {
        try {
            if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

            const token = req.cookies.token;    // Получение токена пользователя

            if (!token) return res.status(401).json({message: "Вы не авторизованы"});

            let decoded;

            try {
                decoded = jwt.verify(token, config.jwtSecret);    // Расшифровываем токен

                if (!decoded.userId) return res.status(401).json({message: "Вы не авторизованы"});

                // Если время жизни куки истекло, нужно перенаправить пользователя на страницу /login или обновить jwt токен refresh токеном
                if (!decoded.iat || !decoded.exp) return res.status(401).json({message: "Время жизни токена истекло"});
            } catch (e) {
                console.log(e);
                return res.status(401).json({message: "Время жизни токена истекло"})
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Произошла ошибка при проверке аутентификации пользователя"});
        }
    };
}

module.exports = new AuthMiddleware();