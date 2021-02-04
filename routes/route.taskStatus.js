const {Router} = require("express");
const TaskStatus = require("../models/TaskStatus");
const router = Router();

router.get('/taskStatus/:id', async (req, res) => {
    try {
        const task = await TaskStatus.findById({_id: req.params.id});

        if (!task) {
            return res.status(400).json({message: "����� ������ �� ����������"});
        }

        res.status(201).json({task: task});
    } catch (e) {
        res.status(500).json({message: "������ ��� �������� ������ � ��������� ������, ����������, ���������� �����"})
    }
});

router.get('/taskStatus', async (req, res) => {
    try {
        const tasks = await TaskStatus.find({});
        res.json(tasks);
    } catch (e) {
        res.status(500).json({message: "������ ��� ��������� ���� ������� � ��������� ������, ����������, ���������� �����"})
    }
});

router.post('/taskStatus', async (req, res) => {
    try {
        const {name, color, notes, isFinish} = req.body;
        const task = await TaskStatus.findOne({name});

        if (task) {
            return res.status(400).json({message: "����� ������ ��� ����������"});
        }

        const newTask = new TaskStatus({name: name, color: color, notes: notes, isFinish: isFinish})

        await newTask.save();

        const currentTask = await TaskStatus.findOne({ name });

        res.status(201).json({message: "������ � ��������� ������ �������", task: currentTask});
    } catch (e) {
        res.status(500).json({message: "������ ��� �������� ������ � ��������� ������, ����������, ���������� �����"})
    }
});

router.put('/taskStatus', async (req, res) => {
    try {
        const {name, color, notes, isFinish} = req.body.values;
        const {_id} = req.body.tabData;
        const task = await TaskStatus.findById({_id});

        if (!task) {
            return res.status(400).json({message: "����� ������ �� �������"});
        }

        task.name = name;
        task.color = color;
        task.notes = notes;
        task.isFinish = isFinish;

        await task.save();

        res.status(201).json({message: "������ � ��������� ������ ��������", task: task});
    } catch (e) {
        res.status(500).json({message: "������ ��� �������������� ������ � ��������� ������, ����������, ���������� �����"})
    }
});

router.delete('/taskStatus', async (req, res) => {
    try {
        const {name, notes} = req.body;
        const task = await TaskStatus.findOne({name});

        if (!task) {
            return res.status(400).json({message: "����� ������ �� �������"});
        }

        await task.delete();

        res.status(201).json({message: "������ � ��������� ������ ������� �������"});
    } catch (e) {
        res.status(500).json({message: "������ ��� �������� ������ � ��������� ������, ����������, ���������� �����"})
    }
});

module.exports = router;