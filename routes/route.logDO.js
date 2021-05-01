// Маршруты для раздела "Журнала дефектов и отказов"
const moment = require("moment");
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const File = require("../schemes/File");
const LogDO = require("../schemes/LogDO");
const Department = require("../schemes/Department");
const Equipment = require("../schemes/Equipment");
const LogDoDto = require("../dto/LogDoDto");
const TaskStatus = require("../schemes/TaskStatus");
const AuthMiddleware = require("../middlewares/auth.middleware");

const router = Router();

const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Валидация полей раздела "Журнал дефектов и отказов"
const checkMiddleware = [
    check("date", "Поле 'Дата заявки' должно быть заполнено").notEmpty().toDate(),
    check("applicant", "Поле 'Заявитель' должно быть заполнено").notEmpty().isObject(),
    check("equipment", "Поле 'Оборудование' должно быть заполнено").notEmpty().isObject(),
    check("notes", "Поле 'Описание' должно содержать от 1 до 1000 символов")
        .notEmpty()
        .isString()
        .isLength({min: 1, max: 1000}),
    check("sendEmail", "Поле 'Оперативное уведомление сотрудников' должно быть булевым").isBoolean(),
    check("productionCheck", "Поле 'Производство остановлено' должно быть булевым").isBoolean(),
    check("task", "Поле 'Задание' не должно превышать 1000 символов")
        .isString()
        .isLength({max: 1000}),
    check("dateDone", "Поле 'Дата выполнения' должно быть датой").toDate(),
    check("planDateDone", "Поле 'Планируемая дата выполнения' должно быть датой").toDate(),
    check("content", "Поле 'Содержание работ' не должно превышать 1000 символов")
        .isString()
        .isLength({max: 1000}),
    check("downtime", "Поле 'Время простоев' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255}),
    check("acceptTask", "Поле 'Работа принята' должно быть булевым").isBoolean(),
];

// Возвращает запись по коду
router.get(
    "/log-do/:id",
    (req, res, next) => {
        AuthMiddleware.canRead(req, res, next, "logDO").then(null);
    },
    async (req, res) => {
        const _id = req.params.id;  // Получение id записи

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
                    taskStatus: null,
                    dateDone: null,
                    planDateDone: null,
                    content: "",
                    downtime: null,
                    acceptTask: false,
                    files: []
                });
            } else {
                // Получение существующей записи
                item = await LogDO.findById({_id})
                    .populate("applicant")
                    .populate({
                        path: "equipment",
                        populate: {
                            path: "parent",
                            model: "Equipment"
                        }
                    })
                    .populate({
                            path: "department",
                            populate: {
                                path: "parent",
                                model: "Department"
                            }
                        }
                    )
                    .populate("responsible")
                    .populate("taskStatus")
                    .populate("files");

                isNewItem = false;
            }

            if (!item) return res.status(500).json({message: `Запись с кодом ${_id} не существует`});

            res.status(200).json({logDo: item, isNewItem});
        } catch (e) {
            res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
        }
    });

// Возвращает все записи
router.get(
    "/log-do/dto/:dateStart/:dateEnd",
    (req, res, next) => {
        AuthMiddleware.canRead(req, res, next, "logDO").then(null);
    },
    async (req, res,) => {
        const dateStart = req.params.dateStart;     // Получаем дату "с"
        const dateEnd = req.params.dateEnd;         // Получаем дату "по"

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        try {
            // Получаем все записи подразделений
            let departments = [];

            try {
                departments = await Department.find({}).populate("parent");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (/log-do/dto)"});
            }

            // Получаем все записи оборудования
            let equipment = [];

            try {
                equipment = await Equipment.find({}).populate("parent");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (/log-do/dto)"});
            }

            // Получаем все записи состояний заявок
            let statuses = [];

            try {
                statuses = await TaskStatus.find({});
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/log-do/dto)"});
            }

            // Получаем все записи ЖДО с фильтром по дате
            let items = [];

            try {
                items = await LogDO.find({date: {$gte: millisecondsStart, $lte: millisecondsEnd}})
                    .sort({date: -1})
                    .populate("applicant")
                    .populate({
                        path: "equipment",
                        populate: {
                            path: "parent",
                            model: "Equipment"
                        }
                    })
                    .populate({
                        path: "department",
                        populate: {
                            path: "parent",
                            model: "Department"
                        }
                    })
                    .populate("responsible")
                    .populate("taskStatus")
                    .populate("files");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/log-do/dto)"});
            }

            let statusLegend = [];  // Инициализация массива легенд статусов

            if (statuses && statuses.length) {
                statuses.forEach(task => {
                    const countTasks = items.filter(logDO =>
                        logDO.taskStatus && logDO.taskStatus._id.toString() === task._id.toString());

                    if (countTasks.length)
                        statusLegend.push({
                            id: task._id,
                            name: task.name,
                            count: countTasks.length,
                            color: task.color
                        });
                });

                // Сколько записей без статуса
                const countWithoutStatus = await LogDO
                    .find({taskStatus: null, date: {$gte: millisecondsStart, $lte: millisecondsEnd}})
                    .countDocuments();

                if (countWithoutStatus)
                    statusLegend.push({
                        id: millisecondsEnd,
                        name: "Без статуса",
                        count: countWithoutStatus,
                        color: "#FFFFFF",
                        borderColor: "black"
                    });
            }

            let itemsDto = [];

            // Изменяем запись для вывода в таблицу
            if (items && items.length) itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

            res.status(200).json({itemsDto, statusLegend});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Ошибка при получении данных"});
        }
    });

// Сохраняет новую запись
router.post(
    "/log-do",
    checkMiddleware,
    (req, res, next) => {
        AuthMiddleware.canEdit(req, res, next, "logDO").then(null);
    },
    async (req, res) => {
        try {
            // Проверка валидации полей раздела "Журнал дефектов и отказов"
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некоректные данные при создании записи"
                });

            let resFileArr = [];    // Создаем результирующий массив файлов

            // Получаем объект записи с фронтенда
            const {
                date,
                applicant,
                equipment,
                notes,
                sendEmail,
                productionCheck,
                department,
                responsible,
                task,
                taskStatus,
                dateDone,
                planDateDone,
                content,
                downtime,
                acceptTask,
                files
            } = req.body;

            // При сохранении записи время реагирования 0, время выполнения 0
            const chooseResponsibleTime = 0;
            const chooseStateTime = 0;

            // Заполняем массив файлов
            if (files && files.length >= 0) {
                for (const file of files) {
                    const findFile = await File.findOne({originUid: file.originUid});

                    findFile.uid = `${findFile._id}-${findFile.name}`;

                    await findFile.save();

                    resFileArr.push(findFile);
                }
            }

            // Создаем новый экземпляр записи
            const item = new LogDO({
                date,
                equipment,
                notes,
                applicant,
                responsible,
                department,
                task,
                taskStatus,
                planDateDone,
                dateDone,
                content,
                acceptTask,
                files: resFileArr,
                sendEmail,
                productionCheck,
                downtime,
                chooseResponsibleTime,
                chooseStateTime
            });

            await item.save();  // Сохраняем запись в базе данных

            // Получаем все записи подразделений
            let departmentsItems = [];

            try {
                departmentsItems = await Department.find({}).populate("parent");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (/log-do, post)"});
            }

            // Получаем все записи оборудования
            let equipmentItems = [];

            try {
                equipmentItems = await Equipment.find({}).populate("parent");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (/log-do, post)"});
            }

            // Ищем запись в базе данных по уникальному идентификатору
            let currentItem = [];

            try {
                currentItem = await LogDO.findById({_id: item._id})
                    .populate("applicant")
                    .populate({
                        path: "equipment",
                        populate: {
                            path: "parent",
                            model: "Equipment"
                        }
                    })
                    .populate({
                            path: "department",
                            populate: {
                                path: "parent",
                                model: "Department"
                            }
                        }
                    )
                    .populate("responsible")
                    .populate("taskStatus")
                    .populate("files");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/log-do, post)"});
            }

            // Изменяем запись для вывода в таблицу
            const savedItem = new LogDoDto(currentItem, departmentsItems, equipmentItems);

            res.status(201).json({message: "Запись сохранена", item: savedItem});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Ошибка при создании записи"});
        }
    });

// Изменяет запись
router.put(
    "/log-do",
    checkMiddleware,
    (req, res, next) => {
        AuthMiddleware.canEdit(req, res, next, "logDO").then(null);
    },
    async (req, res) => {
        try {
            // Проверка валидации полей раздела "Журнал дефектов и отказов"
            const errors = validationResult(req);

            if (!errors.isEmpty())
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некоректные данные при создании записи"
                });

            let resFileArr = [];    // Создаем результирующий массив файлов

            // Получаем объект записи с фронтенда
            const {
                _id,
                date,
                equipment,
                notes,
                applicant,
                responsible,
                department,
                task,
                taskStatus,
                planDateDone,
                dateDone,
                content,
                sendEmail,
                productionCheck,
                downtime,
                acceptTask,
                files
            } = req.body;

            const item = await LogDO.findById({_id});   // Ищем запись в базе данных по уникальному идентификатору

            // Проверяем на существование записи с уникальным идентификатором
            if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не найдена`});

            // Если исполнитель не существует, то высчитываем время с момента назначения до момента создания заявки
            if (!item.responsible && responsible)
                item.chooseResponsibleTime = moment().valueOf() - moment(item.date).valueOf();

            // Если состояние не выбрано, то высчитываем время с момента выбора состояния со статусом "Завершено" до момента создания заявки
            if ((!item.taskStatus || (item.taskStatus && !item.taskStatus.isFinish)) && taskStatus && taskStatus.isFinish)
                item.chooseStateTime = moment().valueOf() - moment(item.date).valueOf();

            // Заполняем массив файлов
            if (files && files.length) {
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
            item.taskStatus = taskStatus;
            item.dateDone = dateDone;
            item.planDateDone = planDateDone;
            item.content = content;
            item.downtime = downtime;
            item.acceptTask = acceptTask;
            item.files = resFileArr;

            await item.save();  // Сохраняем запись в базу данных

            // Получаем все записи подразделений
            let departmentsItems = [];

            try {
                departmentsItems = await Department.find({}).populate("parent");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (/log-do, put)"});
            }

            // Получаем все записи оборудования
            let equipmentItems = [];

            try {
                equipmentItems = await Equipment.find({}).populate("parent");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (/log-do, put)"});
            }

            // Ищем запись в базе данных по уникальному идентификатору
            let currentItem = [];

            try {
                currentItem = await LogDO.findById({_id})
                    .populate("applicant")
                    .populate({
                        path: "equipment",
                        populate: {
                            path: "parent",
                            model: "Equipment"
                        }
                    })
                    .populate({
                            path: "department",
                            populate: {
                                path: "parent",
                                model: "Department"
                            }
                        }
                    )
                    .populate("responsible")
                    .populate("taskStatus")
                    .populate("files");
            } catch (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/log-do, put)"});
            }

            // Изменяем запись для вывода в таблицу
            const savedItem = new LogDoDto(currentItem, departmentsItems, equipmentItems);

            res.status(201).json({message: "Запись сохранена", item: savedItem});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Ошибка при обновлении записи"});
        }
    });

// Удаляет запись
router.delete(
    "/log-do/:id",
    (req, res, next) => {
        AuthMiddleware.canEdit(req, res, next, "logDO").then(null);
    },
    async (req, res) => {
        const _id = req.params.id;  // Получение id записи

        try {
            await LogDO.deleteOne({_id});   // Удаление записи из базы данных по id записи

            res.status(200).json({message: "Запись успешно удалена"});
        } catch (e) {
            res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`});
        }
    });

module.exports = router;