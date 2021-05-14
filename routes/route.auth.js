// Маршруты для авторизации
const {Router} = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {check, validationResult} = require("express-validator");

const config = require("../config/default.json");
const User = require("../schemes/User");
const Role = require("../schemes/Role");
const {permissions, permissionsAdmin} = require("./helper");

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
    check("password", "Поле 'Пароль' должно содержать от 6 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 6, max: 255}),
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

// Регистрация нового пользователя
router.post("/register", checkMiddlewareRegister, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Пользователи"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некорректные данные при регистрации"});

        const {email, firstName, secondName, userName, password} = req.body; // Получаем объект записи с фронтенда

        const candidate = await User.findOne({userName});   // Ищем запись в базе данных по логину

        const candidateEmail  = await User.findOne({email});    // Ищем пользователя в базе данных по почте

        // Проверяем на существование записи с указанным именем пользователя
        if (candidate) return res.status(400).json({message: "Такое имя пользователя занято"});

        // Проверяем на существование записи с указанной почтой
        if (candidateEmail) return res.status(400).json({message: "Такая почта уже используется"});

        const hashedPassword = await bcrypt.hash(password, 12); // Хешируем пароль

        const users = await User.find({});  // Ищем всех пользователей

        let newCandidate;

        // Если пользователей нет, то первый пользователь должен быть одобрен, и ему предоставляются права администратора
        if (!users || !users.length) {
            // Создаем роль "Администратор"
            const roleAdmin = new Role({name: "Администратор", notes: "", permissions: permissionsAdmin});

            // Создаем роль "Зарегистрированный пользователь"
            const roleUser = new Role({name: "Зарегистрированные пользователи", notes: "", permissions});

            await roleAdmin.save();   // Сохраняем роль "Администратор"
            await roleUser.save();   // Сохраняем роль "Зарегистрированные пользователи"

            // Создаем новый экземпляр записи 1-ого пользователя
            newCandidate = new User({
                email, firstName, secondName, userName, password: hashedPassword, approved: true, roles: [roleAdmin._id]
            });
        } else {
            // Создаем новый экземпляр записи n-ого пользователя
            newCandidate = new User({email, firstName, secondName, userName, password: hashedPassword});
        }

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

        // Ищем запись в базе данных по имени пользователя
        const user = await User.findOne({userName}).select("password approved");

        // Проверяем на существование записи
        if (!user) return res.status(400).json({message: "Неверный пользователь или пароль"});

        const isMatch = await bcrypt.compare(password, user.password);  // Сравниваем пароли

        // Проверяем введенный пароль
        if (!isMatch) return res.status(400).json({message: "Неверный пользователь или пароль"});

        if (!user.approved) return res.status(400).json({message: "Данный пользователь не одобрен администратором"});

        // Ищем запись в базе данных по имени пользователя, популизируя все вложенные поля и не работаю с полем 'Пароль'
        const currentUser = await User.findOne({userName}).populate("roles").populate("person").select("-password");

        // Создаем объект "токена"
        const token = jwt.sign(
            {userId: currentUser._id},
            config.jwtSecret,
            {expiresIn: "30min"}
        );

        res.status(200).json({token, userId: currentUser._id, user: currentUser});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при входе, пожалуйста, попробуйте снова: " + err});
    }
});

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