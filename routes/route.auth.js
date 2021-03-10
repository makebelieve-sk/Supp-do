const {Router} = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require("../config/default.json");
const {check, validationResult} = require("express-validator");
const User = require("../models/User");
const router = Router();

// Валидация полей авторизации
const checkMiddleware = [
    check("login", "Некорректное поле 'Логин'").notEmpty().isString().isLength({ max: 255 }),
    check("password", "Минимальная длина пароля 6 символов").notEmpty().isString().isLength({min: 6}),
];

router.post("/register", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при регистрации"});
        }

        const {login, password} = req.body;

        const candidate = await User.findOne({login});

        if (candidate) {
            return res.status(400).json({message: "Такой пользователь уже существует"});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newCandidate = new User({login, password: hashedPassword});

        await newCandidate.save();

        let currentCandidate = await User.findOne({login});

        const token = jwt.sign(
            {userId: currentCandidate.id},
            config.jwtSecret,
            {expiresIn: '1h'}
        );

        res.status(201).json({
            message: "Пользователь создан",
            candidate: currentCandidate,
            token,
            userId: currentCandidate.id
        });
    } catch (e) {
        res.status(500).json({message: "Ошибка при регистрации, пожалуйста, попробуйте снова"})
    }
});

router.post("/login", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при авторизации"});
        }

        const {login, password} = req.body;

        const user = await User.findOne({login});

        if (!user) {
            return res.status(400).json({message: "Такой пользователь не существует"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({message: "Неверный пароль, попробуйте снова"})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.jwtSecret,
            {expiresIn: '1h'}
        );

        res.status(200).json({token, userId: user.id, user});
    } catch (e) {
        res.status(500).json({message: "Ошибка при авторизации, пожалуйста, попробуйте снова"})
    }
});

module.exports = router;