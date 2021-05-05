// Маршруты для раздела "Профессии"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const Profession = require("../schemes/Profession");

const router = Router();

// Валидация полей раздела "Профессии"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

// Возвращает запись по коду
router.get("/professions/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new Profession({name: "", notes: ""});   // Создание новой записи
        } else {
            item = await Profession.findById({_id});    // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(404).json({message: `Профессия с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, profession: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает все записи
router.get("/professions", async (req, res) => {
    try {
        const items = await Profession.find({});    // Получаем все записи раздела "Характеристики оборудования"

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/professions", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Профессии"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, notes} = req.body; // Получаем объект записи с фронтенда

        let item = await Profession.findOne({name});    // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item) return res.status(400).json({message: `Профессия с именем ${name} уже существует`});

        item = new Profession({name, notes});   // Создаем новый экземпляр записи

        await item.save();  // Сохраняем запись в базе данных

        res.status(201).json({message: "Профессия сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/professions", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при изменении записи"
            });

        const {_id, name, notes} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Profession.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Профессия с кодом ${_id} не найдена`});

        item.name = name;
        item.notes = notes;

        await item.save();  // Сохраняем запись в базу данных

        res.status(201).json({message: "Профессия сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/professions/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        await Profession.deleteOne({_id});  // Удаление записи из базы данных по id записи

        res.status(200).json({message: "Профессия успешно удалена"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении профессии с кодом ${_id}: ${err}`});
    }
});

module.exports = router;