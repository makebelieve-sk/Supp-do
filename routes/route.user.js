// Маршруты для раздела "Пользователи"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../schemes/User");
const UserDto = require("../dto/UserDto");

const router = Router();

// Валидация полей раздела "Пользователи"
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
];

// Возвращает запись по коду
router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new User({
                userName: "", person: null, firstName: "", secondName: "", email: "", mailing: false,
                approved: false, roles: []
            });
        } else {
            // Получение существующей записи
            item = await User.findById({_id}).populate("person").populate("roles").select("-password");
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});

        res.status(200).json({isNewItem, user: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает все записи
router.get("/users", async (req, res) => {
    try {
        // Получаем все записи раздела "Пользователи", кроме поля "пароль"
        const items = await User.find({}).populate("person").populate("roles").select("-password");

        let itemsDto = [];

        // Изменяем запись для вывода в таблицу
        if (items && items.length) itemsDto = items.map(item => new UserDto(item));

        res.status(200).json(itemsDto);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/users", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({message: "Некоректные данные при создании записи"});

        // Получаем объект записи с фронтенда
        const {userName, person, firstName, secondName, email, password, mailing, approved, roles} = req.body;

        // Ищем запись в базе данных по наименованию
        let item = await User.findOne({userName}).populate("person").populate("roles").select("-password");

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(404).json({message: `Запись с наименованием ${userName} уже существует`});

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;   // Хешируем пароль

        // Создаем новый экземпляр записи
        item = hashedPassword
            ? new User({
                userName, person, firstName, secondName, email, password: hashedPassword, mailing,
                approved, roles
            })
            : new User({
                userName, person, firstName, secondName, email, mailing,
                approved, roles
            })

        await item.save();  // Сохраняем запись в базе данных

        const currentItem = await User.findOne({_id: item._id})
            .populate("person")
            .populate("roles")
            .select("-password");

        // Изменяем запись для вывода в таблицу
        const savedItem = new UserDto(currentItem);

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/users", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({message: "Некоректные данные при изменении записи"});

        // Получаем объект записи с фронтенда
        const {_id, userName, person, firstName, secondName, email, password, mailing, approved, roles} = req.body;

        // Ищем запись в базе данных по уникальному идентификатору, кроме поля "пароль"
        const item = await User.findById({_id}).populate("person").populate("roles").select("-password");

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не найдена`});

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;   // Хешируем пароль

        item.userName = userName;
        item.person = person;
        item.firstName = firstName;
        item.secondName = secondName;
        item.email = email;
        if (hashedPassword) item.password = hashedPassword;
        item.mailing = mailing;
        item.approved = approved;
        item.roles = roles;

        await item.save();  // Сохраняем запись в базу данных

        const currentItem = await User
            .findOne({_id})
            .populate("person")
            .populate("roles")
            .select("-password");

        // Изменяем запись для вывода в таблицу
        const savedItem = new UserDto(currentItem);

        res.status(201).json({message: "Запись сохранена", item: savedItem, toUpdateUser: currentItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/users/:id", async (req, res) => {
    const _id = req.params.id;  // Получаем _id записи

    try {
        await User.deleteOne({_id});    // Удаление записи из базы данных по id записи

        res.status(200).json({message: "Запись успешно удалена"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}: ${err}`});
    }
});

module.exports = router;