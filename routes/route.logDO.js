// Маршруты для раздела "Журнала дефектов и отказов"
const moment = require("moment");
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const File = require("../schemes/File");
const LogDO = require("../schemes/LogDO");
const Log = require("../schemes/Log");
const Department = require("../schemes/Department");
const Equipment = require("../schemes/Equipment");
const LogDoDto = require("../dto/LogDoDto");
const TaskStatus = require("../schemes/TaskStatus");
const sendingEmail = require("../send/send.email");
const sendingSms = require("../send/send.sms");
const {getUser} = require("./helper");

const router = Router();

const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Валидация полей раздела "Журнал дефектов и отказов"
const checkMiddleware = [
    check("date", "Поле 'Дата заявки' должно быть заполнено").notEmpty().toDate(),
    check("applicant", "Поле 'Заявитель' должно быть заполнено из списка").notEmpty().isObject(),
    check("equipment", "Поле 'Оборудование' должно быть заполнено из списка").notEmpty().isObject(),
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

/**
 * Функция логирования действий пользователея
 * @param req - объект req запроса
 * @param res - объект res запроса
 * @param action - действие пользователя
 * @param body - удаляемая запись
 * @returns {Promise<*>} - возвращаем промис (сохранение записи в бд)
 */
const logUserActions = async (req, res, action, body = null) => {
    if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

    let {
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
        acceptTask
    } = req.body;

    if (body) {
        date = body.date;
        applicant = body.applicant;
        equipment = body.equipment;
        notes = body.notes;
        sendEmail = body.sendEmail;
        productionCheck = body.productionCheck;
        department = body.department;
        responsible = body.responsible;
        task = body.task;
        taskStatus = body.taskStatus;
        dateDone = body.dateDone;
        planDateDone = body.planDateDone;
        content = body.content;
        downtime = body.downtime;
        acceptTask = body.acceptTask;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Журнал дефектов и отказов, Дата заявки: ${date}, Заявитель: ${applicant ? applicant.name : ""}, 
        Оборудование: ${equipment ? equipment.name : ""}, Описание: ${notes}, Оперативное уведомление ответственных специалистов: ${sendEmail},
        Производство остановлено: ${productionCheck}, Подразделение: ${department ? department.name : ""}, Ответственный: ${responsible ? responsible.name : ""},
        Задание: ${task}, Состояние: ${taskStatus ? taskStatus.name : ""}, Дата выполнения: ${dateDone},
        Планируемая дата выполнения: ${planDateDone}, Содержание работ: ${content}, Время простоя: ${downtime},
        Работа принята: ${acceptTask},`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/logDO/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

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

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json({logDo: item, isNewItem});
    } catch (err) {
        res.status(500).json({message: `Ошибка при открытии записи: ${err}`})
    }
});

// Возвращает все записи
router.get("/logDO/dto/:dateStart/:dateEnd", async (req, res) => {
    try {
        const dateStart = req.params.dateStart;     // Получаем дату "с"
        const dateEnd = req.params.dateEnd;         // Получаем дату "по"

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        // Получаем все записи подразделений
        let departments = [];

        try {
            departments = await Department.find({}).populate("parent");
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (/logDO/dto)"});
        }

        // Получаем все записи оборудования
        let equipment = [];

        try {
            equipment = await Equipment.find({}).populate("parent");
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (/logDO/dto)"});
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
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
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/logDO/dto)"});
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
                    borderColor: "#d9d9d9"
                });
        }

        let itemsDto = [];

        // Изменяем запись для вывода в таблицу
        if (items && items.length) itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

        res.status(200).json({itemsDto, statusLegend});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при получении записей: ${err}`});
    }
});

// Сохраняет новую запись
router.post("/logDO", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Журнал дефектов и отказов"
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });
        }

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
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (/logDO, post)"});
        }

        // Получаем все записи оборудования
        let equipmentItems = [];

        try {
            equipmentItems = await Equipment.find({}).populate("parent");
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (/logDO, post)"});
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
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/logDO, post)"});
        }

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        // Изменяем запись для вывода в таблицу
        const savedItem = new LogDoDto(currentItem, departmentsItems, equipmentItems);

        // Отправляем письма и СМС уведомления
        if (sendEmail) {
            await sendingEmail(req, res);
            await sendingSms(req, res);
        }

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/logDO", checkMiddleware, async (req, res) => {
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
        if (!item) return res.status(404).json({message: `Запись с именем ${name} (${_id}) не найдена`});

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
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (/logDO, put)"});
        }

        // Получаем все записи оборудования
        let equipmentItems = [];

        try {
            equipmentItems = await Equipment.find({}).populate("parent");
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (/logDO, put)"});
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
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/logDO, put)"});
        }

        // Изменяем запись для вывода в таблицу
        const savedItem = new LogDoDto(currentItem, departmentsItems, equipmentItems);

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/logDO/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        // Ищем текущую запись
        const item = await LogDO
            .findById({_id})
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
            .populate("taskStatus");

        if (item) {
            await LogDO.deleteOne({_id});   // Удаление записи из базы данных по id записи
            await logUserActions(req, res, "Удаление", item);   // Логируем действие пользвателя
            return res.status(200).json({message: "Запись успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        res.status(500).json({message: `Ошибка при удалении записи: ${err}`});
    }
});

// Обновляем даты у записей в режиме "demo"
router.get("/logDO/update/:date", async (req, res) => {
    try {
        const currentDate = req.params.date;     // Получаем дату "с"

        // Получаем все записи ЖДО с фильтром по дате
        const items = await LogDO.find({}).sort({date: -1});

        if (items && items.length) {
            // Получаем разницу между текущей датой и датой создания последней записи
            const diff = moment(currentDate, dateFormat).diff(moment(items[0].date, dateFormat));

            items.forEach(logDO => {
                logDO.date = moment(logDO.date, dateFormat).valueOf() + diff;

                logDO.save();
            });
        }

        return res.status(200).json("Даты записей успешно обновлены");
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при обновлении дат записей: ${err}`});
    }
});

module.exports = router;