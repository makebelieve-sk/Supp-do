// Маршруты для "Журнала дефектов и отказов"
const moment = require("moment");
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const File = require("../models/File");
const LogDO = require("../models/LogDO");
const router = Router();

const dateFormat = "DD.MM.YYYY HH:mm";

// Валидация полей раздела "Журнал дефектов и отказов"
const checkMiddleware = [
    check("date", "Некорректный формат поля 'Дата заявки'").notEmpty().isString(),
    check("applicant", "Некорректный формат поля 'Заявитель'").notEmpty(),
    check("equipment", "Некорректный формат поля 'Оборудование'").notEmpty(),
    check("notes", "Максимальная длина поля 'Описание' составляет 1000 символов").notEmpty().isString().isLength({min: 0, max: 1000}),
    check("sendEmail", "Некорректное формат поля 'Оперативное уведомление сотрудников'").isBoolean(),
    check("productionCheck", "Некорректное формат поля 'Производство остановлено'").isBoolean(),
    // check("task", "Максимальная длина поля 'Задание' составляет 1000 символов").isString().isLength({min: 0, max: 1000}),
    // check("dateDone", "Некорректный формат поля 'Заявитель'").isString(),
    // check("planDateDone", "Некорректный формат поля 'Заявитель'").isString(),
    // check("content", "Максимальная длина поля 'Содержание работ' составляет 1000 символов").isString().isLength({min: 0, max: 1000}),
    // check("downtime", "Максимальная длина поля 'Время простоя' составляет 255 символов").isString().isLength({min: 0, max: 255}),
    // check("acceptTask", "Некорректное формат поля 'Работа принята'").isBoolean(),
];

// Возвращает запись по коду
router.get("/log-do/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new LogDO({
                date: moment(),
                applicant: null,
                equipment: null,
                notes: "",
                sendEmail: false,
                productionCheck: false,
                department: null,
                responsible: null,
                task: "",
                state: null,
                dateDone: null,
                planDateDone: null,
                content: "",
                downtime: null,
                acceptTask: false,
                files: []
            });
        } else {
            // Редактирование существующей записи
            item = await LogDO.findById({_id})
                .populate("applicant")
                .populate("equipment")
                .populate("department")
                .populate("responsible")
                .populate("state")
                .populate("files");

            isNewItem = false;
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});
        }

        res.status(201).json({isNewItem, logDO: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/log-do/:dateStart/:dateEnd", async (req, res) => {
    const dateStart = req.params.dateStart;
    const dateEnd = req.params.dateEnd;

    const millisecondsStart = moment(dateStart, dateFormat).valueOf();
    const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

    try {
        const items = await LogDO.find({date: { $gte: millisecondsStart, $lte: millisecondsEnd }})
            .sort({ date: 1 })
            .populate('applicant')
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("files");

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении данных"})
    }
});

// Сохраняет новую запись
router.post("/log-do", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        let resFileArr = [];

        let {date, applicant, equipment, notes, sendEmail, productionCheck, department, responsible, task, state,
            dateDone, planDateDone, content, downtime, acceptTask, files} = req.body;

        if (files && files.length >= 0) {
            for (const file of files) {
                const findFile = await File.findOne({originUid: file.originUid});

                findFile.uid = `${findFile._id}-${findFile.name}`;

                await findFile.save();

                resFileArr.push(findFile);
            }
        }

        const item = new LogDO({
            date, equipment, notes, applicant, responsible, department, task, state, dateDone,
            content, acceptTask, files: resFileArr, sendEmail, productionCheck, planDateDone, downtime
        });

        await item.save();

        let currentItem = await LogDO.findById({_id: item._id})
            .populate("applicant")
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("files");

        res.status(201).json({message: "Запись сохранена", item: currentItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/log-do', checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        let resFileArr = [];
        const {_id, date, applicant, equipment, notes, sendEmail, productionCheck, department, responsible, task, state,
            dateDone, planDateDone, content, downtime, acceptTask, files} = req.body;
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

        item.date = date;
        item.applicant = applicant;
        item.equipment = equipment;
        item.notes = notes;
        item.sendEmail = sendEmail;
        item.productionCheck = productionCheck;
        item.department = department;
        item.responsible = responsible;
        item.task = task;
        item.state = state;
        item.dateDone = dateDone;
        item.planDateDone = planDateDone;
        item.content = content;
        item.downtime = downtime;
        item.acceptTask = acceptTask;
        item.files = resFileArr;

        await item.save();

        let savedItem = await LogDO.findById({_id})
            .populate("applicant")
            .populate("equipment")
            .populate("department")
            .populate("responsible")
            .populate("state")
            .populate("files");

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete('/log-do/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        await LogDO.deleteOne({_id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;