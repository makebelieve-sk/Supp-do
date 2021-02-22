// Маршруты для "Журнала дефектов и отказов"
const {Router} = require("express");
const File = require("../models/File");
const LogDO = require("../models/LogDO");
const router = Router();
const moment = require("moment");

const dateFormat = "DD.MM.YYYY HH:mm";

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
router.get("/log-do/:dateStart/:dateEnd", async (req, res) => {
    const dateStart = req.params.dateStart;
    const dateEnd = req.params.dateEnd;

    const millisecondsStart = moment(dateStart, dateFormat).valueOf();
    const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

    try {
        const logsDO = await LogDO.find({})
            .populate('applicant')
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("acceptTask")
            .populate("files");

        let items = logsDO.filter(item => {
            let millisecondsDate = moment(item.date, dateFormat).valueOf();
            return millisecondsDate >= millisecondsStart && millisecondsDate <= millisecondsEnd;
        });

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
                const findFile = await File.findOne({originUid: file.originUid});

                findFile.uid = `${findFile._id}-${findFile.name}`;

                await findFile.save();

                resFileArr.push(findFile);
            }
        }

        const newItem = new LogDO({
            numberLog, date, equipment, notes, applicant, responsible, department, task, state, dateDone,
            content, acceptTask, files: resFileArr, sendEmail
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

        res.status(201).json({message: "Запись сохранена", item: currentItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/log-do', async (req, res) => {
    try {
        let resFileArr = [];
        const {_id, numberLog, date, applicant, equipment, notes, sendEmail, department, responsible, task, state,
            dateDone, content, acceptTask, files} = req.body;
        const item = await LogDO.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        if (files && files.length >= 0) {
            for (const file of files) {
                if (file.uid.slice(0, 3) === "-1-") {
                    const findFile = await File.findOne({originUid: file.originUid});

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