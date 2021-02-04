const {Router} = require("express");
const TaskStatus = require("../models/TaskStatus");
const router = Router();

router.get('/taskStatus/:id', async (req, res) => {
    try {
        const task = await TaskStatus.findById({_id: req.params.id});

        if (!task) {
            return res.status(400).json({message: "Такой записи не существует"});
        }

        res.status(201).json({task: task});
    } catch (e) {
        res.status(500).json({message: "Ошибка при открытии записи о состоянии заявки, пожалуйста, попробуйте снова"})
    }
});

router.get('/taskStatus', async (req, res) => {
    try {
        const tasks = await TaskStatus.find({});
        res.json(tasks);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении всех записей о состоянии заявок, пожалуйста, попробуйте снова"})
    }
});

router.post('/taskStatus', async (req, res) => {
    try {
        const {name, color, notes, isFinish} = req.body;
        const task = await TaskStatus.findOne({name});

        if (task) {
            return res.status(400).json({message: "Такая запись уже существует"});
        }

        const newTask = new TaskStatus({name: name, color: color, notes: notes, isFinish: isFinish})

        await newTask.save();

        const currentTask = await TaskStatus.findOne({ name });

        res.status(201).json({message: "Запись о состоянии заявки создана", task: currentTask});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи о состоянии заявки, пожалуйста, попробуйте снова"})
    }
});

router.put('/taskStatus', async (req, res) => {
    try {
        const {name, color, notes, isFinish} = req.body.values;
        const {_id} = req.body.tabData;
        const task = await TaskStatus.findById({_id});

        if (!task) {
            return res.status(400).json({message: "Такая запись не найдена"});
        }

        task.name = name;
        task.color = color;
        task.notes = notes;
        task.isFinish = isFinish;

        await task.save();

        res.status(201).json({message: "Запись о состоянии заявки изменена", task: task});
    } catch (e) {
        res.status(500).json({message: "Ошибка при редактировании записи о состоянии заявки, пожалуйста, попробуйте снова"})
    }
});

router.delete('/taskStatus', async (req, res) => {
    try {
        const {name, notes} = req.body;
        const task = await TaskStatus.findOne({name});

        if (!task) {
            return res.status(400).json({message: "Такая запись не найдена"});
        }

        await task.delete();

        res.status(201).json({message: "Запись о состоянии заявки успешно удалена"});
    } catch (e) {
        res.status(500).json({message: "Ошибка при удалении записи о состоянии заявки, пожалуйста, попробуйте снова"})
    }
});

module.exports = router;