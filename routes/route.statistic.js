// Маршруты для раздела "Статистика" вкладка Рейтинг
const {Router} = require("express");
const moment = require("moment");

const Equipment = require("../schemes/Equipment");
const LogDO = require("../schemes/LogDO");
const TaskStatus = require("../schemes/TaskStatus");
const Department = require("../schemes/Department");
const LogDoDto = require("../dto/LogDoDto");
const {getNameWithParent, getShortName} = require("../helper");

const router = Router();

const dateFormat = "DD.MM.YYYY HH:mm";  // Устанавливаем формат времени
moment.locale("ru");            // Русифицируем библиотеку moment

// Возвращает данные для вкладки Рейтинг
router.get("/statistic-rating/:dateStart/:dateEnd", async (req, res) => {
    try {
        const dateStart = req.params.dateStart;     // Получаем дату "с"
        const dateEnd = req.params.dateEnd;         // Получаем дату "по"

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        let logDOs = [], equipment = [];
        let statisticRating = [];

        try {
            equipment = await Equipment.find({});
        } catch (e) {
            console.log(e.message);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (Рейтинг)"
            });
        }

        try {
            logDOs = await LogDO
                .find({date: {$gte: millisecondsStart, $lte: millisecondsEnd}})
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
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных 'ЖДО'(Рейтинг)"
            });
        }

        if (equipment && equipment.length && logDOs && logDOs.length) {
            equipment.forEach(eq => {
                // Получаем массив подходящих записей из ЖДО
                const findLogDOs = logDOs.filter(logDO => logDO.equipment._id.toString() === eq._id.toString());

                let during = 0, notAssigned = 0, inWork = 0, done = 0, accept = 0, satisfies = [];

                if (findLogDOs && findLogDOs.length) {
                    findLogDOs.forEach(findLogDOs => {
                        // Считаем количество неназначенных заявок
                        if (!findLogDOs.responsible && !findLogDOs.taskStatus) notAssigned += 1;

                        // Считаем количество заявок в работе
                        if (findLogDOs.responsible && findLogDOs.taskStatus && !findLogDOs.taskStatus.isFinish) inWork += 1;

                        // Считаем количество выполненных заявок
                        if (findLogDOs.taskStatus && findLogDOs.taskStatus.isFinish) done += 1;

                        // Считаем количество принятых заявок
                        if (findLogDOs.acceptTask) accept += 1;

                        // Считаем общую продолжительность простоев, ч
                        during += findLogDOs.downtime / 60;
                    });

                    satisfies = findLogDOs.map(logDO => logDO.equipment._id);

                    statisticRating.push({
                        _id: eq._id,
                        equipment: eq.name,
                        notAssigned: notAssigned.toString(),
                        inWork: inWork.toString(),
                        done: done.toString(),
                        accept: accept.toString(),
                        failure: findLogDOs.length,
                        during: during.toFixed(2),
                        satisfies
                    });
                }
            });
        }

        // Отправляем ответ
        res.status(200).json(statisticRating);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Ошибка при получении данных статистики, вкладка Рейтинг отказов"});
    }
});

// Возвращает данные для вкладки Перечень
router.get("/statistic-list/:dateStart/:dateEnd", async (req, res) => {
    try {
        const dateStart = req.params.dateStart;     // Получаем дату "с"
        const dateEnd = req.params.dateEnd;         // Получаем дату "по"

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        let logDOs = [], statisticList = [], statusesFalse = [], idsFalse = [], equipment = [];

        try {
            statusesFalse = await TaskStatus.find({isFinish: false}).select("_id");

            if (statusesFalse && statusesFalse.length) {
                idsFalse = statusesFalse.map(status => status._id)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (Перечень)"
            });
        }

        try {
            equipment = await Equipment.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (Перечень)"
            });
        }

        try {
            logDOs = await LogDO
                .find({
                    date: {$gte: millisecondsStart, $lte: millisecondsEnd},
                    $or: [{acceptTask: false}, {taskStatus: {$in: idsFalse}}],
                })
                .sort({date: 1})
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
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных 'ЖДО'(Рейтинг)"
            });
        }

        if (logDOs && logDOs.length) {
            logDOs.forEach(logDo => {
                // Продолжительность
                let diff = moment().valueOf() - moment(logDo.date, dateFormat).valueOf();

                const during = (diff / 1000 / 60 / 60).toFixed(2);     // Находим часы

                statisticList.push({
                    _id: logDo._id,
                    equipment: logDo.equipment ? logDo.equipment.name : "",
                    equipmentTooltip: equipment && equipment.length ? logDo.equipment && logDo.equipment.parent ?
                        getNameWithParent(logDo.equipment, equipment) + logDo.equipment.name : "" : "",
                    notes: logDo.notes,
                    applicant: logDo.applicant ? getShortName(logDo.applicant.name) : "",
                    taskStatus: logDo.taskStatus ? logDo.taskStatus.name : "",
                    color: logDo.taskStatus ? logDo.taskStatus.color : "fff",
                    during
                });
            });
        }

        // Отправляем ответ
        res.status(200).json(statisticList);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Ошибка при получении данных статистики, вкладка Перечень не закрытых заявок"});
    }
});

// Возвращает записи ЖДО при клике на "Рейтинг отказов"
router.post("/logDO/rating", async (req, res) => {
    try {
        const {satisfies, equipment, date} = req.body;   // Получаем фильтр с фронтенда

        const millisecondsStart = moment(date.split("/")[0], dateFormat).valueOf();
        const millisecondsEnd = moment(date.split("/")[1], dateFormat).valueOf();

        let departments = [], equipments = [];
        try {
            equipments = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (Рейтинг отказов): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (Рейтинг отказов)"});
        }

        // Даем запрос в бд, передавая нужную дату
        await LogDO.find(
            {
                equipment: {$in: satisfies},
                date: {$gte: millisecondsStart, $lte: millisecondsEnd}
            },
            function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (Рейтинг отказов) " + err});
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[0].date).format(dateFormat);
                    endDate = moment(items[items.length - 1].date).format(dateFormat);

                    // Сортируем записи по полю "Оборудование.Наименование"
                    items = items.sort((a, b) => a.equipment.name < b.equipment.name ? 1 : -1);

                    // Сортируем записи в порядке убывания по полю "Оборудование"
                    items = items.sort((a, b) => {
                        const countA = items.filter(logDO => logDO.equipment._id.toString() === a.equipment._id.toString());
                        const countB = items.filter(logDO => logDO.equipment._id.toString() === b.equipment._id.toString());

                        return countA.length < countB.length ? 1 : -1;
                    });

                    // Получаем массив записей ЖДО (табличный вариант)
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipments));

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
                        const countWithoutStatus = items.filter(logDOs => !logDOs.taskStatus).length;

                        if (countWithoutStatus)
                            statusLegend.push({
                                id: Date.now(),
                                name: "Без статуса",
                                count: countWithoutStatus,
                                color: "#FFFFFF",
                                borderColor: "black"
                            });
                    }
                }

                // Отправляем ответ
                res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: `Рейтинг отказов. Оборудование: ${equipment}`,
                    statusLegend
                });
            }
        )
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
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на "Перечень не закрытых заявок"
router.post("/logDO/list", async (req, res) => {
    try {
        const {date} = req.body;   // Получаем дату с фронтенда

        const millisecondsStart = moment(date.split("/")[0], dateFormat).valueOf();
        const millisecondsEnd = moment(date.split("/")[1], dateFormat).valueOf();

        let departments = [], equipments = [];
        try {
            equipments = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (Перечень не закрытых заявок): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [], statusesFalse = [], idsFalse = [];

        try {
            statuses = await TaskStatus.find({});

            statusesFalse = await TaskStatus.find({isFinish: false}).select("_id");

            if (statusesFalse && statusesFalse.length) {
                idsFalse = statusesFalse.map(status => status._id)
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (Перечень не закрытых заявок)"});
        }

        // Даем запрос в бд, передавая нужную дату
        await LogDO.find(
            {
                $or: [{acceptTask: false}, {taskStatus: {$in: idsFalse}}],
                date: {$gte: millisecondsStart, $lte: millisecondsEnd}
            },
            function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (Перечень не закрытых заявок) " + err});
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[0].date).format(dateFormat);
                    endDate = moment(items[items.length - 1].date).format(dateFormat);

                    // Получаем массив записей ЖДО (табличный вариант)
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipments));

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
                        const countWithoutStatus = items.filter(logDOs => !logDOs.taskStatus).length;

                        if (countWithoutStatus)
                            statusLegend.push({
                                id: Date.now(),
                                name: "Без статуса",
                                count: countWithoutStatus,
                                color: "#FFFFFF",
                                borderColor: "black"
                            });
                    }
                }

                // Отправляем ответ
                res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: "Перечень не закрытых заявок",
                    statusLegend
                });
            }
        )
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
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

module.exports = router;