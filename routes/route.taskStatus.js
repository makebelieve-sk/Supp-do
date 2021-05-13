// Маршруты для раздела "Состояния заявок"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const TaskStatus = require("../schemes/TaskStatus");

const router = Router();

// Валидация полей раздела "Состояния заявок"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("color", "Поле 'Цвет' должно содержать 7 символов")
        .isString()
        .notEmpty()
        .isLength({min: 7, max: 7}),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255}),
    check("isFinish", "Поле 'Завершено' должно быть булевым").isBoolean()
];

// Возвращает запись по коду
router.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new TaskStatus({name: "", color: "#FFFFFF", notes: "", isFinish: false});    // Создание новой записи
        } else {
            item = await TaskStatus.findById({_id});    // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, task: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает все записи
router.get("/tasks", async (req, res) => {
    try {
        const items = await TaskStatus.find({});    // Получаем все записи раздела "Состояния заявок"

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/tasks", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, color, notes, isFinish} = req.body;    // Получаем объект записи с фронтенда

        let item = await TaskStatus.findOne({name});    // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item) return res.status(400).json({message: `Запись с именем ${name} уже существует`});

        // Создаем новый экземпляр записи
        item = new TaskStatus({name: name, color: color, notes: notes, isFinish: isFinish});

        await item.save();  // Сохраняем запись в базе данных

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/tasks", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {_id, name, color, notes, isFinish} = req.body;   // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await TaskStatus.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Запись с именем ${name} (${_id}) не найдена`});

        // Ищем все записи состояний
        const tasks = await TaskStatus.find({});

        if (tasks && tasks.length) {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].name === name && tasks[i]._id.toString() !== _id.toString()) {
                    return res.status(400).json({message: "Состояние заявки с таким именем уже существует"});
                }
            }
        }

        item.name = name;
        item.color = color;
        item.notes = notes;
        item.isFinish = isFinish;

        await item.save();  // Сохраняем запись в базу данных

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/tasks/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        const item = await TaskStatus.findById({_id});  // Ищем текущую запись

        if (item) {
            await TaskStatus.deleteOne({_id});  // Удаление записи из базы данных по id записи
            return res.status(200).json({message: "Запись о состоянии заявки успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}: ${err}`});
    }
});

module.exports = router;