// Маршруты для характеристик оборудования
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const EquipmentProperty = require("../models/EquipmentProperty");
const router = Router();

// Валидация полей раздела "Профессии"
const checkMiddleware = [
    check("name", "Некорректное наименование характеристики оборудования").isString().notEmpty().isLength({ max: 255 }),
    check("notes", "Максимальная длина поля 'Примечание' составляет 255 символов").isString().isLength({ max: 255 })
];

// Возвращает запись по коду
router.get("/equipment-property/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new EquipmentProperty({isCreated: true, tabNumber: null, name: "", notes: ""});
        } else {
            // Редактирование существующей записи
            item = await EquipmentProperty.findById({_id});
            isNewItem = false;
        }

        if (!item) {
            return res.status(400).json({message: `Характеристика с кодом ${_id} не существует`});
        }

        res.status(201).json({isNewItem, equipmentProperty: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`});
    }
});

// Возвращает все записи
router.get("/equipment-property", async (req, res) => {
    try {
        const items = await EquipmentProperty.find({});
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о характеристиках оборудования"});
    }
});

// Сохраняет новую запись
router.post("/equipment-property", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {name, notes} = req.body;
        // Проверяем на существование характеристики с указанным именем
        const item = await EquipmentProperty.findOne({name});

        if (item) {
            return res.status(400).json({message: `Характеристика с именем ${name} уже существует`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        const newItem = new EquipmentProperty({name, notes})

        let savedItem = await newItem.save();

        res.status(201).json({message: "Характеристика сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/equipment-property", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {_id, name, notes} = req.body;
        const item = await EquipmentProperty.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Характеристика с кодом ${_id} не найдена`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        item.name = name;
        item.notes = notes;

        await item.save();

        res.status(201).json({message: "Характеристика сохранена", item: item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении характеристики оборудования"})
    }
});

// Удаляет запись
router.delete("/equipment-property/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        await EquipmentProperty.deleteOne({_id});

        res.status(201).json({message: "Характеристика успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении характеристики с кодом ${_id}`})
    }
});

module.exports = router;