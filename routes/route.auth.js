// Маршруты для авторизации
const {Router} = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {check, validationResult} = require("express-validator");

const config = require("../config/default.json");
const User = require("../schemes/User");

const router = Router();

// Валидация полей регистрации пользователя
const checkMiddlewareRegister = [
    check("userName", "Поле 'Имя пользователя' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("firstName", "Поле 'Имя' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("secondName", "Поле 'Фамилия' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("email", "Поле 'Почта' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("password", "Поле 'Пароль' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
];

// Валидация полей входа пользователя
const checkMiddlewareAuth = [
    check("userName", "Поле 'Имя пользователя' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("password", "Поле 'Пароль' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
];

// Регистрация нового пользователя
router.post("/register", checkMiddlewareRegister, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Пользователи"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некорректные данные при регистрации"});

        const {email, firstName, secondName, userName, password} = req.body; // Получаем объект записи с фронтенда

        const candidate = await User.findOne({userName});   // Ищем запись в базе данных по логину

        // Проверяем на существование записи с указанным именем пользователя
        if (candidate) return res.status(400).json({message: "Такое имя пользователя занято"});

        const hashedPassword = await bcrypt.hash(password, 12); // Хешируем пароль

        // Создаем новый экземпляр записи
        const newCandidate = new User({email, firstName, secondName, userName, password: hashedPassword});

        await newCandidate.save();  // Сохраняем запись в базе данных

        res.status(201).json({message: "Пользователь создан"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при регистрации, пожалуйста, попробуйте снова: " + err});
    }
});

// Вход пользователя
router.post("/login", checkMiddlewareAuth, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при авторизации"});

        const {userName, password} = req.body; // Получаем объект записи с фронтенда

        const user = await User.findOne({userName});    // Ищем запись в базе данных по имени пользователя

        // Проверяем на существование записи
        if (!user) return res.status(400).json({message: "Такой пользователь не существует"});

        const isMatch = await bcrypt.compare(password, user.password);  // Сравниваем пароли

        // Проверяем введенный пароль
        if (!isMatch) return res.status(400).json({message: "Неверный пароль, попробуйте снова"});

        if (!user.approved) return res.status(400).json({message: "Данный пользователь не одобрен администратором"});

        // Создаем объект "токена"
        const token = jwt.sign(
            {userId: user.id},
            config.jwtSecret,
            {expiresIn: "1h"}
        );

        res.status(200).json({token, userId: user.id, user});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при входе, пожалуйста, попробуйте снова: " + err});
    }
});

module.exports = router;