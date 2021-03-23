// Маршруты для состоянии заявок
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const TaskStatus = require("../schemes/TaskStatus");
const router = Router();

// Валидация полей раздела "Состояние заявки"
const checkMiddleware = [
    check("name", "Некорректное наименование состояния заявки").isString().notEmpty().isLength({ max: 255 }),
    check("color", "Некорректный формат поля 'Цвет'").isString().notEmpty().isLength({ min: 7, max: 7 }),
    check("notes", "Максимальная длина поля 'Примечание' составляет 255 символов").isString().isLength({ max: 255 }),
    check("isFinish", "Поле 'Завершено' должно быть булевым").isBoolean()
];

// Возвращает запись по коду
router.get("/taskStatus/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new TaskStatus({name: "", color: "#FFFFFF", notes: "", isFinish: false});
        } else {
            // Редактирование существующей записи
            item = await TaskStatus.findById({_id});
            isNewItem = false;
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});
        }

        res.status(201).json({isNewItem, task: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/taskStatus", async (req, res) => {
    try {
        const items = await TaskStatus.find({});
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о состоянии заявок"})
    }
});

// Сохраняет новую запись
router.post("/taskStatus", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {name, color, notes, isFinish} = req.body;

        let item = await TaskStatus.findOne({name});

        if (item) {
            return res.status(400).json({message: `Запись с именем ${name} уже существует`});
        }

        item = new TaskStatus({name: name, color: color, notes: notes, isFinish: isFinish})
        await item.save();

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/taskStatus", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {_id, name, color, notes, isFinish} = req.body;
        const item = await TaskStatus.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        item.name = name;
        item.color = color;
        item.notes = notes;
        item.isFinish = isFinish;

        await item.save();

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи о состоянии заявки"})
    }
});

// Удаляет запись
router.delete("/taskStatus/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        await TaskStatus.deleteOne({_id});

        res.status(201).json({message: "Запись о состоянии заявки успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;