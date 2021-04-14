// Маршруты для раздела "Помощь"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Help = require("../schemes/Help");
const router = Router();

// Валидация полей раздела "Помощь"
const checkMiddleware = [check("name", "Некорректное наименование записи").notEmpty()];

// Возвращает запись по коду
router.get("/help/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new Help({name: null, text: "", date: null});
        } else {
            // Редактирование существующей записи
            item = await Help.findById({_id});
            isNewItem = false;
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});
        }

        res.status(201).json({isNewItem, help: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает запись при клике на кнопку "Помощь"
router.get("/help/get/:id", async (req, res) => {
    const value = req.params.id;   // поле value объекта name

    try {
        const item = await Help.findOne({"name.value": value}); // Находим нужную запись

        const response = item ? {title: item.name.label, text: item.text} : null;   // Составляем объект ответа

        res.status(201).json(response); // Отправляем ответ
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записи помощи при клике на кнопку 'Помощь'"})
    }
});

// Возвращает все записи
router.get("/help", async (req, res) => {
    try {
        const items = await Help.find({});

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей помощи"})
    }
});

// Сохраняет новую запись
router.post("/help", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {name, text} = req.body;

        let item = await Help.findOne({name});

        if (item) {
            return res.status(400).json({message: `Запись с наименованием ${name} уже существует`});
        }

        item = new Help({name, text, date: Date.now()});
        await item.save();

        res.status(201).json({message: "Запись сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/help", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при изменении записи"});
        }

        const {_id, name, text} = req.body;
        const item = await Help.findById({_id});

        if (!name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        item.name = name;
        item.text = text;
        item.date = Date.now();

        await item.save();

        res.status(201).json({message: "Запись сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete("/help/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        await Help.deleteOne({_id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;