// Маршруты для "Журнала дефектов и отказов"
const {Router} = require("express");
const Equipment = require("../models/Equipment");
const File = require("../models/File");
const LogDO = require("../models/LogDO.model");
const router = Router();

// Возвращает запись по коду
router.get('/log-do/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const item = await LogDO.findById({_id: id})
            .populate('applicant')
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("acceptTask")
            .populate("files");

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${id} не существует`});
        }

        res.status(201).json({logDO: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${id}`})
    }
});

// Возвращает все записи
router.get("/log-do", async (req, res) => {
    try {
        const items = await LogDO.find({})
            .populate('applicant')
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("acceptTask")
            .populate("files");

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении данных"})
    }
});

// Сохраняет новую запись
router.post('/log-do', async (req, res) => {
    try {
        let resFileArr = [];

        let {date, numberLog, applicant, equipment, notes, sendEmail, department, responsible, task, state,
            dateDone, content, acceptTask, files} = req.body;

        const item = await LogDO.findOne({numberLog});

        if (item) {
            numberLog = numberLog.slice(0, 3) + numberLog.slice(3, 4) * 1 + 1;
        }

        if (files && files.length >= 0) {
            for (const file of files) {
                const findFile = await File.findOne({name: file.name});

                findFile.uid = `${findFile._id}-${findFile.name}`;

                await findFile.save();

                resFileArr.push(findFile);
            }
        }

        const newItem = new LogDO({
            numberLog: numberLog, date: date, applicant: applicant, equipment: equipment, notes: notes, sendEmail: sendEmail,
            department: department, responsible: responsible, task: task, state: state, dateDone: dateDone, content: content,
            acceptTask: acceptTask, files: resFileArr
        });

        await newItem.save();

        let currentItem = await LogDO.findOne({numberLog})
            .populate('applicant')
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("acceptTask")
            .populate("files");

        console.log(currentItem);
        res.status(201).json({message: "Запись сохранена", item: currentItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/log-do', async (req, res) => {
    try {
        const {_id, numberLog, date, applicant, equipment, notes, sendEmail, department, responsible, task, state,
            dateDone, content, acceptTask, files} = req.body;

        const item = await LogDO.findById({_id});

        let resFileArr = [];

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        if (files && files.length >= 0) {
            for (const file of files) {
                if (file.uid.slice(0, 3) === "-1-") {
                    const findFile = await File.findOne({name: file.name});

                    findFile.uid = `${findFile._id}-${file.name}`

                    await findFile.save();

                    resFileArr.push(findFile);
                } else {
                    resFileArr.push(file);
                }
            }
        }

        item.numberLog = numberLog;
        item.date = date;
        item.applicant = applicant;
        item.equipment = equipment;
        item.notes = notes;
        item.sendEmail = sendEmail;
        item.department = department;
        item.responsible = responsible;
        item.task = task;
        item.state = state;
        item.dateDone = dateDone;
        item.content = content;
        item.acceptTask = acceptTask;
        item.files = resFileArr;

        await item.save();

        let savedItem = await LogDO.findById({_id})
            .populate('applicant')
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("acceptTask")
            .populate("files");

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete('/log-do/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await LogDO.deleteOne({_id: id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${id}`})
    }
});

module.exports = router;