// Маршруты для авторизации
const {Router} = require("express");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");

const User = require("../schemes/User");

const router = Router();

// Валидация полей входа пользователя
const checkMiddleware = [
    check("oldPassword", "Поле 'Старый пароль' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("password", "Поле 'Пароль' должно содержать от 6 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 6, max: 255}),
    check("userId", "Вы не авторизованы")
        .isString()
        .notEmpty()
];

// Вход пользователя
router.put("/changePassword", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при авторизации"});

        const {oldPassword, password, userId} = req.body; // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по имени пользователя
        const user = await User.findById({_id: userId}).select("password");

        // Проверяем на существование записи
        if (!user) return res.status(400).json({message: "Такого пользователя не существует"});

        const isMatch = await bcrypt.compare(oldPassword, user.password);  // Сравниваем пароли

        // Проверяем старый пароль
        if (!isMatch) return res.status(400).json({message: "Старый пароль указан неверно"});

         // Хешируем пароль
        user.password = await bcrypt.hash(password, 12);

        await user.save();  // Сохраняем пользователя с новым паролем

        res.status(200).json({message: "Ваш пароль успешно изменён"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при изменении пароля: " + err});
    }
});

module.exports = router;