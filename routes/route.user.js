// Маршруты для раздела "Пользователи"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../schemes/User");
const Log = require("../schemes/Log");
const UserDto = require("../dto/UserDto");
const {getUser} = require("./helper");

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
    check("phone", "Поле 'Телефон' должно содержать 11 цифр")
        .isString()
        .notEmpty()
        .isLength({min: 11, max: 11}),
];

/**
 * Функция логирования действий пользователея
 * @param req - объект req запроса
 * @param res - объект res запроса
 * @param action - действие пользователя
 * @param body - удаляемая запись
 * @returns {Promise<*>} - возвращаем промис (сохранение записи в бд)
 */
const logUserActions = async (req, res, action, body = null) => {
    if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

    let {userName, person, firstName, secondName, email} = req.body;

    if (body) {
        userName = body.userName;
        person = body.person;
        firstName = body.firstName;
        secondName = body.secondName;
        email = body.email;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Пользователи, Имя пользователя: ${userName}, Сотрудник: ${person ? person.name : ""}, Почта: ${email}, Имя: ${firstName}, Фамилия: ${secondName}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/users/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new User({
                userName: "", person: null, firstName: "", secondName: "", email: "", phone: "", mailing: false, sms: false,
                approved: false, roles: [], typeMenu: [{label: "Сверху", value: "top"}]
            });
        } else {
            // Получение существующей записи
            item = await User.findById({_id}).populate("person").populate("roles").select("-password");
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});

        return res.status(200).json({isNewItem, user: item});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при открытии записи: ${err}`});
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

        return res.status(200).json(itemsDto);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/users", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({message: "Некоректные данные при создании записи"});

        // Получаем объект записи с фронтенда
        const {userName, person, firstName, secondName, email, sms, phone, password, mailing, approved, roles} = req.body;

        // Ищем запись в базе данных по наименованию
        let item = await User.findOne({userName}).populate("person").populate("roles").select("-password");

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(404).json({message: `Запись с наименованием ${userName} уже существует`});

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;   // Хешируем пароль

        // Создаем новый экземпляр записи
        item = hashedPassword
            ? new User({
                userName, person, firstName, secondName, email, sms, phone, password: hashedPassword, mailing,
                approved, roles, typeMenu: [{label: "Сверху", value: "top"}]
            })
            : new User({
                userName, person, firstName, secondName, email, sms, phone, mailing,
                approved, roles, typeMenu: [{label: "Сверху", value: "top"}]
            })

        let currentItem = await item.save();  // Сохраняем запись в базе данных

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        currentItem = await User.findById({_id: currentItem._id})
            .populate("person")
            .populate("roles")
            .select("-password");

        // Изменяем запись для вывода в таблицу
        const savedItem = new UserDto(currentItem);

        return res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/users", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({message: "Некоректные данные при изменении записи"});

        // Получаем объект записи с фронтенда
        const {_id, userName, person, firstName, secondName, email, sms, phone, password, mailing, approved, roles} = req.body;

        // Ищем запись в базе данных по уникальному идентификатору, кроме поля "пароль"
        const item = await User.findById({_id}).populate("person").populate("roles").select("-password");

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Запись с именем ${userName} (${_id}) не найдена`});

        // Ищем всех пользователей
        const users = await User.find({});

        if (users && users.length) {
            try {
                users.forEach(user => {
                    if (user.userName === userName && user._id.toString() !== _id.toString()) {
                        throw new Error("Запись с таким именем уже существует");
                    }
                })
            } catch (e) {
                return res.status(400).json({message: e.message});
            }
        }

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;   // Хешируем пароль

        item.userName = userName;
        item.person = person;
        item.firstName = firstName;
        item.secondName = secondName;
        item.email = email;
        item.phone = phone;
        if (hashedPassword) item.password = hashedPassword;
        item.mailing = mailing;
        item.sms = sms;
        item.approved = approved;
        item.roles = roles;

        await item.save();  // Сохраняем запись в базу данных

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        const currentItem = await User
            .findById({_id})
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
    try {
        const _id = req.params.id;  // Получаем _id записи

        const item = await User.findById({_id}).populate("person");  // Ищем текущую запись

        if (item) {
            await User.deleteOne({_id});    // Удаление записи из базы данных по id записи
            await logUserActions(req, res, "Удаление", item);   // Логируем действие пользвателя
            return res.status(200).json({message: "Запись успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи: ${err}`});
    }
});

module.exports = router;