// Маршруты для раздела "Профессии"
const {Router} = require("express");
const Profession = require("../models/Profession");
const router = Router();

// Возвращает запись по коду
router.get('/professions/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        let item;

        if (_id === "-1") {
            // Создание новой записи
            item = new Profession({isCreated: true, name: "", notes: ""});
        } else {
            // Редактирование существующей записи
            item = await Profession.findById({_id});
        }

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${_id} не существует`});
        }

        res.status(201).json({profession: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
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

        let item = await Profession.findOne({name});

        if (item) {
            return res.status(400).json({message: `Профессия с именем ${name} уже существует`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        item = new Profession({isCreated: false, name, notes});
        await item.save();

        res.status(201).json({message: "Профессия сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/professions', async (req, res) => {
    try {
        const {_id, isCreated, name, notes} = req.body;
        const item = await Profession.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${_id} не найдена`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        item.isCreated = isCreated;
        item.name = name;
        item.notes = notes;

        await item.save();

        res.status(201).json({message: "Профессия сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении профессии"})
    }
});

// Удаляет запись
router.delete('/professions/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        await Profession.deleteOne({_id});

        res.status(201).json({message: "Профессия успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении профессии с кодом ${_id}`})
    }
});

module.exports = router;