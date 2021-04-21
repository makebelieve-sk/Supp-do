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
        .isLength({min: 1, max: 255}),
    check("notes", "Поле 'Описание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

// Возвращает запись по коду
router.get("/roles/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

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
        ];

        if (_id === "-1") {
            item = new Role({name: "", notes: "", permissions});    // Создание новой записи
        } else {
            item = await Role.findById({_id});  // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        // Проверка на равенство разделов
        if (item.permissions.length !== permissions.length) {
            if (item.permissions.length < permissions.length) {
                // Если мы добавили раздел
                permissions.forEach((permission, index) => {
                    if (!item.permissions[index]) item.permissions.push(permission);
                });
            } else {
                // Если мы удалили раздел
                let result = [];

                permissions.forEach(permission => {
                    item.permissions.forEach(perm => {
                        if (perm.key === permission.key) result.push(perm);
                    });
                });

                item.permissions = result;
            }

            await item.save();  // Сохраняем запись с обновленными разрешениями
        }

        res.status(201).json({isNewItem, role: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает все записи
router.get("/roles", async (req, res) => {
    try {
        const items = await Role.find({});  // Получаем все записи раздела "Роли"

        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/roles", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.status(400).json({message: "Некоректные данные при создании записи"});

        const {name, notes, permissions} = req.body;    // Получаем объект записи с фронтенда

        let item = await Role.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Запись с наименованием ${name} уже существует`});

        item = new Role({name, notes, permissions});    // Создаем новый экземпляр записи

        await item.save();  // Сохраняем запись в базе данных

        res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/roles", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({message: "Некоректные данные при изменении записи"});

        const {_id, name, notes, permissions} = req.body;   // Получаем объект записи с фронтенда

        const item = await Role.findById({_id});    // Ищем запись в базе данных по уникальному идентификатору

        item.name = name;
        item.notes = notes;
        item.permissions = permissions;

        await item.save();  // Сохраняем запись в базу данных

        res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/roles/:id", async (req, res) => {
    const _id = req.params.id;  // Получаем _id записи

    try {
        await Role.deleteOne({_id});    // Удаление записи из базы данных по id записи

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}: ${err}`});
    }
});

module.exports = router;