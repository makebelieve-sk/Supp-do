// Маршруты для раздела "Пользователи"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../schemes/User");
const Role = require("../schemes/Role");
const UserDto = require("../dto/UserDto");

const router = Router();

// Валидация полей раздела "Пользователи"
const checkMiddleware = [
    check("userName", "Некорректное наименование пользователя")
        .isString()
        .notEmpty()
        .isLength({min: 0, max: 255}),
    check("firstName", "Некорректное имя пользователя")
        .isString()
        .notEmpty()
        .isLength({min: 0, max: 255}),
    check("secondName", "Некорректная фамилия пользователя")
        .isString()
        .notEmpty()
        .isLength({min: 0, max: 255}),
];

// Возвращает запись по коду
router.get("/users/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true, roles;

        if (_id === "-1") {
            // Создание новой записи
            item = new User({userName: "", person: null, firstName: "", secondName: "", email: "", mailing: false,
                approved: false, roles: []});
        } else {
            // Редактирование существующей записи
            item = await User.findById({_id}).populate("person").populate("roles").select("-password");
            isNewItem = false;
        }

        if (!item)
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        // Получаем список ролей
        try {
            roles = await Role.find({});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Ошибка при получении записей из базы данных 'Роли'"});
        }

        res.status(201).json({isNewItem, user: item, roles});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`});
    }
});

// Возвращает все записи
router.get("/users", async (req, res) => {
    try {
        const items = await User.find({}).populate("person").populate("roles").select("-password");

        let itemsDto = [];

        if (items && items.length) itemsDto = items.map(item => new UserDto(item));

        res.json(itemsDto);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при получении пользователей"})
    }
});

// Сохраняет новую запись
router.post("/users", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {userName, person, firstName, secondName, email, password, mailing, approved, roles} = req.body;

        let item = await User.findOne({userName}).populate("person").populate("roles").select("-password");

        if (item)
            return res.status(400).json({message: `Запись с наименованием ${userName} уже существует`});

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;   // Хешируем пароль

        item = new User({userName, person, firstName, secondName, email, password: hashedPassword, mailing,
            approved, roles});

        await item.save();  // Сохраняем запись в бд

        const currentItem = await User.findOne({_id: item._id})
            .populate("person")
            .populate("roles")
            .select("-password");

        const savedItem = new UserDto(currentItem);

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при создании записи"});
    }
});

// Изменяет запись
router.put("/users", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({
            errors: errors.array(),
            message: "Некоректные данные при изменении записи"
        });

        const {_id, userName, person, firstName, secondName, email, password, mailing, approved, roles} = req.body;

        const item = await User.findById({_id}).populate("person").populate("roles").select("-password");

        if (!item)
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;   // Хешируем пароль

        item.userName = userName;
        item.person = person;
        item.firstName = firstName;
        item.secondName = secondName;
        item.email = email;
        item.password = hashedPassword;
        item.mailing = mailing;
        item.approved = approved;
        item.roles = roles;

        await item.save();  // Сохраняем запись в бд

        const currentItem = await User.findOne({_id}).populate("person").populate("roles").select("-password");

        const savedItem = new UserDto(currentItem);

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete("/users/:id", async (req, res) => {
    const _id = req.params.id;  // Получаем _id записи

    try {
        await User.deleteOne({_id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;