// Маршруты для подразделений
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Department = require("../models/Department");
const router = Router();

// Валидация полей раздела "Подразделения"
const checkMiddleware = [
    check("name", "Некорректное наименование подразделения").isString().notEmpty().isLength({ max: 255 }),
    check("notes", "Максимальная длина поля 'Примечание' составляет 255 символов").isString().isLength({ max: 255 })
];

// Возвращает запись по коду
router.get("/departments/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item;

        if (_id === "-1") {
            // Создание новой записи
            item = new Department({isCreated: true, name: "", notes: "", parent: null});
        } else {
            // Редактирование существующей записи
            item = await Department.findById({_id}).populate("parent");
        }

        if (!item) {
            return res.status(400).json({message: `Подразделение с кодом ${req.params.id} не существует`});
        }

        res.status(201).json({department: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${req.params.id}`})
    }
});

// Возвращает все записи
router.get("/departments", async (req, res) => {
    try {
        const items = await Department.find({}).populate("parent");

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о подразделениях"})
    }
});

// Сохраняет новую запись
router.post("/departments", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {name, notes, parent} = req.body;
        const item = await Department.findOne({name});

        if (item) {
            return res.status(400).json({message: `Подразделение с именем ${name} уже существует`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        const newItem = new Department({isCreated: false, parent, name, notes});
        await newItem.save();

        let currentDepartment;

        if (!parent) {
            currentDepartment = await Department.findOne({name});
        } else {
            currentDepartment = await Department.findOne({name}).populate("parent");
        }

        res.status(201).json({message: "Подразделение сохранено", item: currentDepartment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/departments", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {_id, isCreated, name, notes, parent} = req.body;
        const item = await Department.findById({_id}).populate("parent");

        if (!item) {
            return res.status(400).json({message: `Подразделение с кодом ${_id} не найдено`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Отдел не может принадлежать сам себе"});
            }
        }

        item.isCreated = isCreated;
        item.parent = parent;
        item.name = name;
        item.notes = notes;

        await item.save();

        let savedItem = await Department.findById({_id}).populate("parent");

        res.status(201).json({message: "Подразделение сохранено", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении  подразделения"})
    }
});

// Удаляет запись
router.delete("/departments/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        await Department.deleteOne({_id});

        res.status(201).json({message: "Подразделение успешно удалено"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении подразделения с кодом ${_id}`});
    }
});

module.exports = router;