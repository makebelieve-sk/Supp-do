// Маршруты для раздела "Характеристики оборудования"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const EquipmentProperty = require("../schemes/EquipmentProperty");

const router = Router();

// Валидация полей раздела "Характеристики оборудования"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: 255 }),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({ max: 255 })
];

// Возвращает запись по коду
router.get("/equipment-property/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new EquipmentProperty({name: "", notes: ""});    // Создание нового экземпляра записи
        } else {
            item = await EquipmentProperty.findById({_id});          // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Характеристика с кодом ${_id} не существует`});

        res.status(201).json({isNewItem, equipmentProperty: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`});
    }
});

// Возвращает все записи
router.get("/equipment-property", async (req, res) => {
    try {
        const items = await EquipmentProperty.find({}); // Получаем все записи раздела "Характеристики оборудования"

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о характеристиках оборудования"});
    }
});

// Сохраняет новую запись
router.post("/equipment-property", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {name, notes} = req.body;     // Получаем объект записи с фронтенда

        const item = await EquipmentProperty.findOne({name});   // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Характеристика с именем ${name} уже существует`});

        const newItem = new EquipmentProperty({name, notes});   // Создаем новый экземпляр записи

        const savedItem = await newItem.save(); // Сохраняем запись в базе данных

        res.status(201).json({message: "Характеристика сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/equipment-property", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {_id, name, notes} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await EquipmentProperty.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(400).json({message: `Характеристика с кодом ${_id} не найдена`});

        item.name = name;
        item.notes = notes;

        await item.save();  // Сохраняем запись в базу данных

        res.status(201).json({message: "Характеристика сохранена", item: item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении характеристики оборудования"})
    }
});

// Удаляет запись
router.delete("/equipment-property/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        await EquipmentProperty.deleteOne({_id});   // Удаление записи из базы данных по id записи

        res.status(201).json({message: "Характеристика успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении характеристики с кодом ${_id}`})
    }
});

module.exports = router;