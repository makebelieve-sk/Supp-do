// Маршруты для раздела "Помощь"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Help = require("../schemes/Help");

const router = Router();

// Валидация полей раздела "Помощь"
const checkMiddleware = [check("name", "Поле 'Название раздела' должно быть заполнено").notEmpty()];

// Возвращает запись по коду
router.get("/help/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new Help({name: null, text: "", date: null});    // Создание новой записи
        } else {
            item = await Help.findById({_id});  // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        res.status(201).json({isNewItem, help: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает запись при клике на кнопку "Помощь"
router.get("/help/get/:id", async (req, res) => {
    const value = req.params.id;   // поле value объекта name

    try {
        const item = await Help.findOne({"name.value": value}); // Находим нужную запись

        const response = item ? {title: item.name.label, text: item.text} : null;   // Составляем объект ответа

        res.status(201).json(response); // Отправляем ответ
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записи помощи при клике на кнопку 'Помощь': " + err});
    }
});

// Возвращает все записи
router.get("/help", async (req, res) => {
    try {
        const items = await Help.find({});  // Получаем все записи раздела "Характеристики оборудования"

        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/help", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {name, text} = req.body;  // Получаем объект записи с фронтенда

        let item = await Help.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Запись с наименованием ${name} уже существует`});

        item = new Help({name, text, date: Date.now()});    // Создаем новый экземпляр записи

        await item.save();  // Сохраняем запись в базе данных

        res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/help", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при изменении записи"});

        const {_id, name, text} = req.body; // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Help.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});

        item.name = name;
        item.text = text;
        item.date = Date.now();

        await item.save();  // Сохраняем запись в базу данных

        res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/help/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        await Help.deleteOne({_id});    // Удаление записи из базы данных по id записи

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}: ${err}`});
    }
});

module.exports = router;