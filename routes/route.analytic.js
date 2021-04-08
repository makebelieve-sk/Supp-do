const {Router} = require("express");
const router = Router();
const moment = require("moment");
const Department = require("../schemes/Department");
const Equipment = require("../schemes/Equipment");
const TaskStatus = require("../schemes/TaskStatus");
const LogDO = require("../schemes/LogDO");
const LogDoDto = require("../dto/LogDoDto");

const dateFormat = "DD.MM.YYYY HH:mm";  // Устанавливаем формат времени
moment.locale("ru");            // Русифицируем библиотеку moment

// Возвращает данные для аналитики
router.get("/current-state", async (req, res) => {
    try {
        const currentDate = moment().valueOf();                                 // Количество миллисекунд до "сейчас"
        const prevYear = moment().subtract(1, "year").valueOf();    // Кол-во мс до прошлого года

        const departments = await Department.find({});
        let equipment = await Equipment.find({});
        const tasks = await TaskStatus.find({});
        const logDOs = await LogDO.find({})
            .populate("state")
            .populate("responsible")
            .populate("department")
            .populate("equipment");
        const logDOsYear = await LogDO.find({date: {$gte: prevYear, $lte: currentDate}})
            .populate("state")
            .populate("responsible")
            .populate("department");

        // Определение переменных для состояний на текущий момент
        let unassignedTasks = [], inWorkTasks = [], notAccepted = [], workloadDepartments = [];

        // Определение перменных для состояний на текущий месяц
        let failureDynamics = [], averageResponseTime = 0, averageClosingTime = 0;

        // Определение перменных для сравнений периодов
        let changeDowntime = [], changeRefusal = [], bounceRating = [], ratingOrders = [];

        if (logDOs && logDOs.length) {
            // Не назначенные заявки
            unassignedTasks = logDOs.filter(logDO => !logDO.responsible && !logDO.state);

            // Заявки в работе
            inWorkTasks = logDOs.filter(logDO => logDO.state && !logDO.state.isFinish && logDO.responsible);

            // Не принятые заявки
            notAccepted = logDOs.filter(logDO => logDO.state && logDO.state.isFinish && !logDO.acceptTask);

            // Загруженность подразделений
            if (departments && departments.length && tasks && tasks.length) {
                departments.forEach(department => {
                    tasks.forEach(task => {
                        const currentRecords = logDOs.filter(logDO => {
                            if (logDO.department && logDO.state)
                                return logDO.department.name === department.name && logDO.state.name === task.name
                                    && !logDO.state.isFinish;
                        });

                        if (currentRecords && currentRecords.length) {
                            const barChartObject = {
                                department: department.name,
                                state: task.name,
                                value: currentRecords && currentRecords.length ? currentRecords.length : 0
                            };

                            workloadDepartments.push(barChartObject);
                        }
                    })
                })
            }

            // Среднее время реагирования
            let i = 0;  // Счетчик для записей, которые имеют дату выполнения и план. дату выполнения

            logDOs.forEach(logDO => {
                if (logDO.chooseResponsibleTime) {
                    i++;

                    averageResponseTime += logDO.chooseResponsibleTime;
                }
            });

            if (averageResponseTime) {
                const hours = Math.floor(averageResponseTime / i / 1000 / 60 / 60);     // Находим часы
                const minutes = Math.floor(averageResponseTime / i / 1000 / 60 % 60);   // Находим минуты

                // Форматируем конечное значение
                if (hours === 0) {
                    averageResponseTime = minutes;
                } else if (hours.toString().length >= 3) {
                    averageResponseTime = (averageResponseTime / i / 1000 / 60 / 60 / 24).toFixed(1);
                } else {
                    averageResponseTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
                }
            }

            // Среднее время выполнения
            let j = 0;  // Счетчик для записей, которые имеют дату выполнения и план. дату выполнения

            logDOs.forEach(logDO => {
                if (logDO.chooseStateTime && logDO.acceptTask) {
                    j++;

                    averageClosingTime += logDO.chooseStateTime;
                }
            });

            if (averageClosingTime) {
                const hours = Math.floor(averageClosingTime / i / 1000 / 60 / 60);     // Находим часы
                const minutes = Math.floor(averageClosingTime / i / 1000 / 60 % 60);   // Находим минуты

                // Форматируем конечное значение
                if (hours === 0) {
                    averageClosingTime = minutes;
                } else if (hours.toString().length >= 3) {
                    averageClosingTime = (averageClosingTime / i / 1000 / 60 / 60 / 24).toFixed(1);
                } else {
                    averageClosingTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
                }
            }

            const millisecondsInDay = 86400000; // Количество миллисекунд в одном дне

            // Динамика отказов
            for (let i = moment().subtract(1, "month").add(1, "day").valueOf(); i < moment().valueOf(); i += millisecondsInDay) {
                let value = 0;
                const month = moment(i).month().toString().length === 1 ? `0${moment(i).month()}` : moment(i).month();

                logDOs.forEach(logDO => {
                    if (moment(logDO.date).date() === moment(i).date()
                        && moment(logDO.date).month() === moment(i).month()
                        && moment(logDO.date).year() === moment(i).year()
                    ) {
                        value += 1;
                    }
                });

                failureDynamics.push({
                    date: moment(i).date() + "." + month,
                    value: value.toString(),
                    fullDate: moment(i).toString()
                });
            }

            // Изменение простоев
            // Находим записи, созданные в текущем месяце
            const currentMonthLogDOs = logDOs.filter(logDO => moment(logDO.date).month() === moment().month());
            // Находим общую сумму простоев за текущий месяц
            const downtimeCurrentMonth = currentMonthLogDOs.reduce((accum, currentValue) => accum + +currentValue.downtime, 0);

            // Находим записи, созданные в прошлом месяце
            const prevMonthLogDOs = logDOs.filter(logDO => moment(logDO.date).month() === moment().month() - 1);
            // Находим общую сумму простоев за прошлый месяц
            const downtimePrevMonth = prevMonthLogDOs.reduce((accum, currentValue) => accum + +currentValue.downtime, 0);

            // Находим записи, созданные в позапрошлом месяце
            const prevTwoMonthLogDOs = logDOs.filter(logDO => moment(logDO.date).month() === moment().month() - 2);
            // Находим общую сумму простоев за позапрошлый месяц
            const downtimePrevTwoMonth = prevTwoMonthLogDOs.reduce((accum, currentValue) => accum + +currentValue.downtime, 0);

            // Находим записи, созданные в текущем месяце прошлого года
            const prevYearLogDOs = logDOs.filter(logDO => moment(logDO.date).month() === moment().month() &&
                moment(logDO.date).year() === moment().year() - 1);
            // Находим общую сумму простоев за текущий месяц прошлого года
            const downtimePrevYear = prevYearLogDOs.reduce((accum, currentValue) => accum + +currentValue.downtime, 0);

            // Изменение простоев
            changeDowntime = [
                {
                    month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                        + moment().subtract(1, "year").format("YYYY"),
                    value: downtimePrevYear.toString()
                },
                {
                    month: moment().subtract(2, "month").format("MMMM")[0].toUpperCase()
                        + moment().subtract(2, "month").format("MMMM").slice(1, 3) + ". "
                        + moment().format("YYYY"),
                    value: downtimePrevTwoMonth.toString()
                },
                {
                    month: moment().subtract(1, "month").format("MMMM")[0].toUpperCase()
                        + moment().subtract(1, "month").format("MMMM").slice(1, 3) + ". "
                        + moment().format("YYYY"),
                    value: downtimePrevMonth.toString()
                },
                {
                    month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                        + moment().format("YYYY"),
                    value: downtimeCurrentMonth.toString()
                },
            ];

            // Изменение отказов
            changeRefusal = [
                {
                    month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                        + moment().subtract(1, "year").format("YYYY"),
                    value: prevYearLogDOs.length.toString()
                },
                {
                    month: moment().subtract(2, "month").format("MMMM")[0].toUpperCase()
                        + moment().subtract(2, "month").format("MMMM").slice(1, 3) + ". "
                        + moment().format("YYYY"),
                    value: prevTwoMonthLogDOs.length.toString()
                },
                {
                    month: moment().subtract(1, "month").format("MMMM")[0].toUpperCase()
                        + moment().subtract(1, "month").format("MMMM").slice(1, 3) + ". "
                        + moment().format("YYYY"),
                    value: prevMonthLogDOs.length.toString()
                },
                {
                    month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                        + moment().format("YYYY"),
                    value: currentMonthLogDOs.length.toString()
                },
            ];

            // Сортируем оборудование по полю "Наименование"
            equipment = equipment.sort((a, b) => a.name < b.name ? 1 : -1);

            // Рейтинг отказов за 12 месяцев (Топ-5)
            if (equipment && equipment.length) {
                equipment.forEach(eq => {
                    const countEqs = logDOsYear.filter(logDO => logDO.equipment.toString() === eq._id.toString());

                    bounceRating.push({
                        id: eq._id,
                        name: eq.name,
                        value: countEqs ? countEqs.length : 0
                    });
                });

                bounceRating.sort((a, b) => a.value < b.value ? 1 : -1);
                bounceRating.splice(5);
            }

            // Рейтинг незакрытых заявок (Топ-5)
            const countLogs = logDOs.filter(logDO => !logDO.state || (logDO.state && !logDO.state.isFinish));

            if (countLogs && countLogs.length) {
                countLogs.forEach(logDO => {
                    ratingOrders.push({
                        id: logDO._id,
                        name: logDO.equipment.name,
                        value: ((moment().valueOf() - moment(logDO.date).valueOf()) / 1000 / 60 / 60 / 24)
                            .toFixed(1)
                    });
                });

                ratingOrders.sort((a, b) => +a.value <= +b.value ? 1 : -1);
                ratingOrders.splice(5);
            }
        }

        res.status(201).json({
            unassignedTasks,
            inWorkTasks,
            notAccepted,
            workloadDepartments,
            averageResponseTime,
            averageClosingTime,
            failureDynamics,
            changeDowntime,
            changeRefusal,
            bounceRating,
            ratingOrders
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Ошибка при получении данных аналитики"})
    }
});

// Возвращает записи ЖДО при клике на круг
router.post("/go-to-logDO/circle", async (req, res) => {
    try {
        const {unassignedTasks, inWorkTasks} = req.body;   // Извлекаем объект фильтра из тела запроса

        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        let items = [];

        // Даем запрос в бд, передавая фильтр и нужные даты
        if (unassignedTasks) {
            items = await LogDO.find({responsible: null, state: null})
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
                    }
                )
                .populate("responsible")
                .populate("state")
                .populate("files");
        } else if (inWorkTasks) {
            items = await LogDO.find({responsible: {$ne: null}, state: {$ne: null}})
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
                    }
                )
                .populate("responsible")
                .populate("state")
                .populate("files");

            if (items && items.length) {
                items = items.filter(obj => !obj.state.isFinish);
            }
        } else {
            items = await LogDO.find({acceptTask: false, state: {$ne: null}})
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
                    }
                )
                .populate("responsible")
                .populate("state")
                .populate("files");

            if (items && items.length) {
                items = items.filter(obj => obj.state.isFinish);
            }
        }

        let itemsDto = [];
        const startDate = moment(items[0].date).format(dateFormat);              // Получаем начальную дату записей
        const endDate = moment(items[items.length - 1].date).format(dateFormat);  // Получаем конечную дату записей

        if (items && items.length) {
            itemsDto = items.map(item => new LogDoDto(item, departments, equipment));
        }

        res.status(201).json({itemsDto, startDate, endDate});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"})
    }
});

// Возвращает записи ЖДО при клике на гистограмму
router.post("/go-to-logDO/bar", async (req, res) => {
    try {
        const {department, state} = req.body;   // Извлекаем объект из тела запроса

        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Даем запрос в бд, передавая фильтр и нужные даты
        let items = await LogDO.find({department: {$ne: null}, state: {$ne: null}})
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
                }
            )
            .populate("responsible")
            .populate("state")
            .populate("files");

        let itemsDto = [], startDate = null, endDate = null;

        if (items && items.length) {
            // Фильтруем подходящие записи
            items = items.filter(logDO => logDO.department.name === department && logDO.state.name === state);

            startDate = moment(items[0].date).format(dateFormat);              // Получаем начальную дату записей
            endDate = moment(items[items.length - 1].date).format(dateFormat);  // Получаем конечную дату записей

            // Получаем готовый объект записи ЖДО
            itemsDto = items.map(item => new LogDoDto(item, departments, equipment));
        }

        res.status(201).json({itemsDto, startDate, endDate});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"})
    }
});

// Возвращает записи ЖДО при клике на линейную диаграмму
router.post("/go-to-logDO/line", async (req, res) => {
    try {
        const {fullDate} = req.body;   // Извлекаем объект из тела запроса

        const millisecondsStart = moment(fullDate).startOf("day").valueOf();    // Перевод выбранной даты в миллисекунды
        const millisecondsEnd = moment(fullDate).endOf("day").valueOf();    // Перевод выбранной даты в миллисекунды

        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Даем запрос в бд, передавая фильтр и нужные даты
        const items = await LogDO.find({date: {$gte: millisecondsStart, $lte: millisecondsEnd}})
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
                }
            )
            .populate("responsible")
            .populate("state")
            .populate("files");

        let itemsDto = [];
        const startDate = moment(items[0].date).format(dateFormat);              // Получаем начальную дату записей
        const endDate = moment(items[items.length - 1].date).format(dateFormat);  // Получаем конечную дату записей

        if (items && items.length) {
            // Получаем готовый объект записи ЖДО
            itemsDto = items.map(item => new LogDoDto(item, departments, equipment));
        }

        res.status(201).json({itemsDto, startDate, endDate});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"})
    }
});

// Возвращает записи ЖДО при клике на "Рейтинг отказов за 12 месяцев"
router.get("/go-to-logDO/rating/bounceRating", async (req, res) => {
    try {
        // Рассчитываем количество миллисекунд до предыдущего года
        const prevYearMilliseconds = moment().subtract(1, "year").valueOf();

        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Даем запрос в бд, передавая нужную дату
        await LogDO.find(
            {
                equipment: {$ne: null},
                date: {$gte: prevYearMilliseconds, $lte: moment().valueOf()}
            },
            function(err, items) {
                // Обработка ошибки
                if (err)
                    res.status(500).json({
                        message: "Возникла ошибка при получении записей из базы данных ЖДО (bounceRating)"
                    });

                // Получаем начальную и конечную даты записей
                const startDate = moment(items[0].date).format(dateFormat);
                const endDate = moment(items[items.length - 1].date).format(dateFormat);

                // Сортируем записи по полю "Оборудование.Наименование"
                items = items.sort((a, b) => a.equipment.name < b.equipment.name ? 1 : -1);

                // Сортируем записи в порядке убывания по полю "Оборудование"
                items = items.sort((a, b) => {
                    const countA = items.filter(logDO => logDO.equipment._id.toString() === a.equipment._id.toString());
                    const countB = items.filter(logDO => logDO.equipment._id.toString() === b.equipment._id.toString());

                    return countA.length < countB.length ? 1 : -1;
                });

                // Получаем массив записей ЖДО
                const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

                // Отправляем ответ
                res.status(201).json({itemsDto, startDate, endDate});
            }
        )
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
                }
            )
            .populate("responsible")
            .populate("state")
            .populate("files");
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"});
    }
});

// Возвращает записи ЖДО при клике на "Рейтинг незакрытых заявок"
router.get("/go-to-logDO/rating/ratingOrders", async (req, res) => {
    try {
        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
        await TaskStatus.find({isFinish: false}, function(err, docs) {
            // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false
            const ids = docs.map(doc => doc._id);

            // Выполняем поиск в базе данных "LogDO" по полю "state"
            LogDO
                .find(
                    {$or: [{state: {$in: ids}}, {state: null}]},
                    function(err, items) {
                        // Обработка ошибки
                        if (err)
                            res.status(500).json({
                                message: "Возникла ошибка при получении записей из базы данных ЖДО (ratingOrders)"
                            });

                        // Получаем начальную и конечную даты записей
                        const startDate = moment(items[0].date).format(dateFormat);
                        const endDate = moment(items[items.length - 1].date).format(dateFormat);

                        // Сортируем записи в порядке убывания по незавершенному статусу заявки
                        items = items.sort((a, b) => {
                            const firstDiff = moment().valueOf() - moment(a.date).valueOf();
                            const secondDiff = moment().valueOf() - moment(b.date).valueOf();

                            return firstDiff - secondDiff > 0 ? -1 : 1;
                        });

                        // Получаем готовый массив записей ЖДО
                        const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

                        // Отправляем ответ
                        res.status(201).json({itemsDto, startDate, endDate});
                    }
                )
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
                    }
                )
                .populate("responsible")
                .populate("state")
                .populate("files");
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"});
    }
});

module.exports = router;