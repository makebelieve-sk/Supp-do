// Маршруты для раздела "Роли"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Role = require("../schemes/Role");

const router = Router();

// Валидация полей раздела "Роли"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 0, max: 255}),
    check("notes", "Поле 'Описание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

// Возвращает запись по коду
router.get("/roles/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        // Создаем массив разрешений
        const permissions = [
            {title: "Профессии", read: false, edit: false, key: "professions"},
            {title: "Подразделения", read: false, edit: false, key: "departments"},
            {title: "Персонал", read: false, edit: false, key: "people"},
            {title: "Перечень оборудования", read: false, edit: false, key: "equipment"},
            {title: "Характеристики оборудования", read: false, edit: false, key: "equipmentProperties"},
            {title: "Состояния заявок", read: false, edit: false, key: "tasks"},
            {title: "Журнал дефектов и отказов", read: false, edit: false, key: "logDO"},
            {title: "Помощь", read: false, edit: false, key: "help"},
            {title: "Пользователи", read: false, edit: false, key: "users"},
            {title: "Роли", read: false, edit: false, key: "roles"},
            {title: "Журнал действий пользователей", read: false, edit: false, key: "logs"},
            {title: "Аналитика", read: false, edit: false, key: "analytic"},
            {title: "Статистика", read: false, edit: false, key: "statistic"},
            {title: "Новый раздел", read: false, edit: false, key: "newSection"},
        ];

        if (_id === "-1") {
            // Создание новой записи
            item = new Role({name: "", notes: "", permissions});
        } else {
            // Редактирование существующей записи
            item = await Role.findById({_id});
            isNewItem = false;
        }

        if (!item)
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        res.status(201).json({isNewItem, role: item});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/roles", async (req, res) => {
    try {
        const items = await Role.find({});

        res.json(items);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при получении пользователей"})
    }
});

// Сохраняет новую запись
router.post("/roles", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, notes, permissions} = req.body;

        let item = await Role.findOne({name});

        if (item)
            return res.status(400).json({message: `Запись с наименованием ${name} уже существует`});

        item = new Role({name, notes, permissions});

        await item.save();  // Сохраняем запись в бд

        res.status(201).json({message: "Запись сохранена", item});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при создании записи"});
    }
});

// Изменяет запись
router.put("/roles", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при изменении записи"
            });


        const {_id, name, notes, permissions} = req.body;

        const item = await Role.findById({_id});

        item.name = name;
        item.notes = notes;
        item.permissions = permissions;

        await item.save();  // Сохраняем запись в бд

        res.status(201).json({message: "Запись сохранена", item});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete("/roles/:id", async (req, res) => {
    const _id = req.params.id;  // Получаем _id записи

    try {
        await Role.deleteOne({_id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;