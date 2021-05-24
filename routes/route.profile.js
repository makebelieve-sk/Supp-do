// Маршруты для профиля
const {Router} = require("express");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");

const User = require("../schemes/User");

const router = Router();

// Валидация полей входа пользователя
const checkMiddleware = [
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
    check("phone", "Поле 'Телефон' должно содержать 11 цифр")
        .isString()
        .notEmpty()
        .isLength({min: 11, max: 11}),
];

// Получение профиля пользователя
router.get("/edit-profile/:id", async (req, res) => {
    try {
        const _id = req.params.id;

        // Ищем запись в базе данных по имени пользователя
        const user = await User
            .findById({_id})
            .select("-password")
            .select("-roles")
            .select("-person")
            .select("-approved")

        // Проверяем на существование записи
        if (!user) return res.status(400).json({message: "Такого пользователя не существует"});

        res.status(200).json({profile: user});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка получения профиля: " + err});
    }
});

// Изменение профиля пользователя
router.put("/edit-profile", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Профиль"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при изменении профиля"});

        // Получаем объект записи с фронтенда
        const {email, firstName, mailing, password, phone, secondName, sms, typeMenu, userName, _id} = req.body;

        // Ищем запись в базе данных по имени пользователя
        const user = await User.findById({_id});

        // Проверяем на существование записи
        if (!user) return res.status(400).json({message: "Такого пользователя не существует"});

        // Хешируем пароль
        if (password) {
            user.password = await bcrypt.hash(password, 12);
        }

        user.email = email;
        user.firstName = firstName;
        user.mailing = mailing;
        user.phone = phone;
        user.secondName = secondName;
        user.sms = sms;
        user.typeMenu = typeMenu;
        user.userName = userName;

        await user.save();  // Сохраняем пользователя с обновленным профилем

        // Объект пользовтаеля для профиля
        const item = await User
            .findById({_id})
            .select("-password")
            .select("-roles")
            .select("-person")
            .select("-approved");

        // Объект пользователя для авторизации (reducerAuth)
        const updateUser = await User
            .findById({_id})
            .populate("person")
            .populate("roles")
            .select("-password");

            res.status(200).json({message: "Ваш профиль успешно изменён", item, toUpdateUser: updateUser});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при изменении профиля: " + err});
    }
});

module.exports = router;