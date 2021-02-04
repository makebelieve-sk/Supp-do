// Маршруты для характеристик оборудования
const {Router} = require("express");
const EquipmentProperty = require("../models/EquipmentProperty");
const router = Router();

// Возвращает запись по коду
router.get('/equipment-property/:id', async (req, res) => {
    try {
        const item = await EquipmentProperty.findById({_id: req.params.id});

        if (!item) {
            return res.status(400).json({message: `Характеристика с кодом ${req.params.id} не существует`});
        }

        res.status(201).json({equipmentProperty: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${req.params.id}`});
    }
});

// Возвращает все записи
router.get('/equipment-property', async (req, res) => {
    try {
        const items = await EquipmentProperty.find({});
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о характеристиках оборудования"});
    }
});

// Сохраняет новую запись
router.post('/equipment-property', async (req, res) => {
    try {
        const {name, notes} = req.body;
        // Проверяем на существование характеристики с указанным именем
        const item = await EquipmentProperty.findOne({name});

        if (item) {
            return res.status(400).json({message: `Характеристика с именем ${name} уже существует`});
        }

        const newItem = new EquipmentProperty({name: name, notes: notes})

        let savedItem = await newItem.save();

        res.status(201).json({message: "Характеристика сохранена", equipmentProperty: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/equipment-property', async (req, res) => {
    try {
        const {_id, name, notes} = req.body;
        const item = await EquipmentProperty.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Характеристика с кодом ${_id} не найдена`});
        }

        item.name = name;
        item.notes = notes;

        await item.save();

        res.status(201).json({message: "Характеристика сохранена", equipmentProperty: item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении характеристики оборудования"})
    }
});

// Удаляет запись
router.delete('/equipment-property/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await EquipmentProperty.deleteOne({_id: id});

        res.status(201).json({message: "Характеристика успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении характеристики с кодом ${id}`})
    }
});

module.exports = router;