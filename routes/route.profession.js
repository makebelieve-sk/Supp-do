// Маршруты для профессий
const {Router} = require("express");
const Profession = require("../models/Profession");
const router = Router();

// Возвращает запись по коду
router.get('/professions/:id', async (req, res) => {
    try {
        let item;

        if (req.params.id === "-1") {
            // Находим уже созданный пустой документ
            const emptyItem = await Profession.findOne({itemId: "-1"});

            // Если созданный пустой документ есть, возвращаем его, иначе создаем пустой документ
            if (emptyItem) {
                item = emptyItem;
            } else {
                // Создание новой записи
                item = await Profession.create({itemId: "-1", name: " ", notes: ""});
            }
        } else {
            // Редактирование существующей записи
            item = await Profession.findById({_id: req.params.id});
        }

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${req.params.id} не существует`});
        }
        console.log(item)

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
        const {_id, name, notes} = req.body;
        const item = await Profession.findOne({_id});

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${_id} не найдена`});
        }

        if (item.name === name) {
            return res.status(400).json({message: `Профессия с именем ${name} уже существует`});
        }
        console.log("Перед сохранением", item)
        item.itemId = _id;
        item.name = name;
        item.notes = notes;
        console.log(item)

        await item.save();

        res.status(201).json({message: "Профессия сохранена", item: item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/professions', async (req, res) => {
    try {
        const {_id, itemId, name, notes} = req.body;
        const item = await Profession.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Профессия с кодом ${_id} не найдена`});
        }

        item.itemId = itemId;
        item.name = name;
        item.notes = notes;

        await item.save();

        res.status(201).json({message: "Профессия сохранена", item: item});
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