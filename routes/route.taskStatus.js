// Маршруты для состоянии заявок
const {Router} = require("express");
const TaskStatus = require("../models/TaskStatus");
const router = Router();

// Возвращает запись по коду
router.get('/taskStatus/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new TaskStatus({name: "", color: "#FFFFFF", notes: "", isFinish: false});
        } else {
            // Редактирование существующей записи
            item = await TaskStatus.findById({_id});
            isNewItem = false;
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});
        }

        res.status(201).json({isNewItem, task: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get('/taskStatus', async (req, res) => {
    try {
        const items = await TaskStatus.find({});
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о состоянии заявок"})
    }
});

// Сохраняет новую запись
router.post('/taskStatus', async (req, res) => {
    try {
        const {name, color, notes, isFinish} = req.body;

        let item = await TaskStatus.findOne({name});

        if (item) {
            return res.status(400).json({message: `Запись с именем ${name} уже существует`});
        }

        item = new TaskStatus({name: name, color: color, notes: notes, isFinish: isFinish})
        await item.save();

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/taskStatus', async (req, res) => {
    try {
        const {_id, name, color, notes, isFinish} = req.body;
        const item = await TaskStatus.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        item.name = name;
        item.color = color;
        item.notes = notes;
        item.isFinish = isFinish;

        await item.save();

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи о состоянии заявки"})
    }
});

// Удаляет запись
router.delete('/taskStatus/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        await TaskStatus.deleteOne({_id});

        res.status(201).json({message: "Запись о состоянии заявки успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;