// Маршруты для профессий
const {Router} = require("express");
const Profession = require("../models/Profession");
const router = Router();

// Возвращает запись по коду
router.get('/professions/:id', async (req, res) => {
    try {
        const item = await Profession.findById({_id: req.params.id});

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${req.params.id} не существует`});
        }

        res.status(201).json({profession: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${req.params.id}`})
    }
});

// Возвращает все записи
router.get('/professions', async (req, res) => {
    try {
        const items = await Profession.find({});
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о профессиях"})
    }
});

// Сохраняет новую запись
router.post('/professions', async (req, res) => {
    try {
        const {name, notes} = req.body;
        const item = await Profession.findOne({name});

        if (item) {
            return res.status(400).json({message: `Профессия с именем ${name} уже существует`});
        }

        const newItem = new Profession({name: name, notes: notes})

        let savedItem = await newItem.save();

        res.status(201).json({message: "Профессия сохранена", profession: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/professions', async (req, res) => {
    try {
        const {_id, name, notes} = req.body;
        const item = await Profession.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${_id} не найдена`});
        }

        item.name = name;
        item.notes = notes;

        await item.save();

        res.status(201).json({message: "Профессия сохранена", profession: item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении профессии"})
    }
});

// Удаляет запись
router.delete('/professions/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Profession.deleteOne({_id: id});

        res.status(201).json({message: "Профессия успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении профессии с кодом ${id}`})
    }
});

module.exports = router;