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

/**
 * Функция преобразования миллисекунд в сек/мин/сут
 * @param result - среднее значение времени
 * @param arr - массив записей (нужен для количества)
 * @returns string - возвращаем строку
 */
const transformTime = (result, arr) => {
    if (result) {
        const hours = Math.floor(result / arr.length / 1000 / 60 / 60);     // Находим часы
        const minutes = Math.floor(result / arr.length / 1000 / 60 % 60);   // Находим минуты

        // Форматируем конечное значение
        if (hours === 0) {
            result = minutes;
        } else if (hours.toString().length >= 3) {
            result = (result / arr.length / 1000 / 60 / 60 / 24).toFixed(1);
        } else {
            result = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
        }
    }

    return result;
}

/**
 * Функция получения неназначенных заявок
 * @returns {Promise<*>} количество документов из бд
 */
const getUnassignedTasks = async () => {
    try {
        return await LogDO.find({responsible: null, state: null}).countDocuments();
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения заявок в работе
 * ids - массив объектов с полями _id
 * @returns {Promise<*>} количество документов из бд
 */
const getInWorkTasks = async (ids) => {
    try {
        return await LogDO
            .find({$and: [{state: {$ne: null}, responsible: {$ne: null}}, {state: {$in: ids}}]})
            .countDocuments();
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения непринятых заявок
 * ids - массив объектов с полями _id
 * @returns {Promise<*>} количество документов из бд
 */
const getNotAccepted = async (ids) => {
    try {
        return await LogDO
            .find({$and: [{state: {$ne: null}, acceptTask: false}, {state: {$in: ids}}]})
            .countDocuments();
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения загруженности подразделений
 * ids - массив объектов с полями _id
 * @returns {Promise<*>} массив объектов для гистрограммы
 */
const getWorkloadDepartments = async (tasks, departments) => {
    try {
        let result = [];    // Результирующий массив

        const logDOs = await LogDO
            .find({$and: [{department: {$ne: null}}, {state: {$ne: null}}, {state: {$in: tasks}}]})
            .populate("state")
            .populate("department");

        if (departments && departments.length && tasks && tasks.length) {
            departments.forEach(department => {
                tasks.forEach(task => {
                    // Фильтруем подходящие записи
                    const currentRecords = logDOs.filter(logDO =>
                        logDO.department.name === department.name && logDO.state.name === task.name);

                    if (currentRecords && currentRecords.length) {
                        // Пушим объект
                        result.push({
                            department: department.name,
                            state: task.name,
                            value: currentRecords.length
                        });
                    }
                })
            })
        }

        return result;
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения динамики отказов
 * logDOs - массив всех записей ЖДО
 * @returns массив объектов для линейной диаграммы
 */
const getFailureDynamics = (logDOs) => {
    let result = [];
    const millisecondsInDay = 86400000; // Количество миллисекунд в одном дне
    // Кол-во миллисекунд месяц назад/на данный момент
    const start = moment().subtract(1, "month").add(1, "day").valueOf();
    const end = moment().valueOf();

    for (let i = start; i < end; i += millisecondsInDay) {
        let value = 0;
        // Форматируем месяц в формат 'mm' из 'm'
        const month = moment(i).month().toString().length === 1 ? `0${moment(i).month()}` : moment(i).month();

        logDOs.forEach(logDO => {
            if (moment(logDO.date).date() === moment(i).date()
                && moment(logDO.date).month() === moment(i).month()
                && moment(logDO.date).year() === moment(i).year()
            ) {
                value += 1;
            }
        });

        result.push({
            date: moment(i).date() + "." + month,
            value: value.toString(),
            fullDate: moment(i).toString()
        });
    }

    return result;
}

/**
 * Функция получения среднего времени реагирования
 * @returns среднее время реагирования
 */
const getAverageResponseTime = async () => {
    try {
        let result = 0;    // Результат

        const logDOs = await LogDO
            .find({$and: [{chooseResponsibleTime: {$ne: null}}, {chooseResponsibleTime: {$ne: 0}}]})
            .select("chooseResponsibleTime")
            // .aggregate([{"$project": {"TotalChooseResponsibleTime": {"$sum": "chooseResponsibleTime"}}}]);

        logDOs.forEach(logDO => result += +logDO.chooseResponsibleTime);

        return transformTime(result, logDOs);
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения среднего времени выполнения
 * @returns среднее время реагирования
 */
const getAverageClosingTime = async () => {
    try {
        let result = 0;    // Результат

        const logDOs = await LogDO
            .find({$and: [{acceptTask: true}, {chooseStateTime: {$ne: null}}, {chooseStateTime: {$ne: 0}}]})
            .select("chooseStateTime");

        logDOs.forEach(logDO => result += +logDO.chooseStateTime);

        return transformTime(result, logDOs);
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения изменения простоев/изменения отказов
 * logDOs - массив записей ЖДО
 * flag - если true, возвращаем изменение простоев, иначе изменение отказов
 * @returns среднее время реагирования
 */
const getChangeDowntime = async (logDOs, flag) => {
    try {
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

        return flag
            ? [
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
            ]
            : [
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
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения рейтинга отказов за 12 месяцев (Топ-5)
 * equipment - массив записей оборудования
 * @returns массив из 5 записей
 */
const getBounceRating = async (equipment) => {
    try {
        let result = [];    // Результирующий массив

        // Сортируем записи по полю "Оборудование.Наименование"
        equipment = equipment.sort((a, b) => a.name < b.name ? 1 : -1);

        for (const eq of equipment) {
            // const countEqs = logDOsYear.filter(logDO => logDO.equipment.toString() === eq._id.toString());

            // Количество миллисекунд до "сейчас"/до прошлого года
            const currentDate = moment().valueOf();
            const prevYear = moment().subtract(1, "year").valueOf();

            await LogDO
                .find(
                    {$and: [{equipment: eq._id.toString()}, {date: {$gte: prevYear, $lte: currentDate}}]},
                    function (err, docs) {
                        result.push({
                            id: eq._id,
                            name: eq.name,
                            value: docs ? docs.length : 0
                        });
                    })
        }

        result.sort((a, b) => a.value < b.value ? 1 : -1);
        result.splice(5);

        return result;
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * Функция получения рейтинга незакрытых заявок (Топ-5)
 * ids - массив объектов с полями _id
 * @returns массив из 5 записей
 */
const getRatingOrders = async (ids) => {
    try {
        let result = [];    // Результирующий массив

        const logDOs = await LogDO
            .find({$or: [{state: null}, {state: {$in: ids}}]})
            .populate("equipment");

        if (logDOs && logDOs.length) {
            logDOs.forEach(logDO => {
                result.push({
                    id: logDO._id,
                    name: logDO.equipment.name,
                    value: ((moment().valueOf() - moment(logDO.date).valueOf()) / 1000 / 60 / 60 / 24).toFixed(1)
                });
            });

            result.sort((a, b) => +a.value <= +b.value ? 1 : -1);
            result.splice(5);
        }

        return result;
    } catch (err) {
        throw new Error(err);
    }
}

// Возвращает данные для аналитики
router.get("/current-state", async (req, res) => {
    try {
        let departments, equipment, fullStatusesFalse, statusesFalse, statusesTrue, logDOs;

        try {
            departments = await Department.find({});
            equipment = await Equipment.find({});
            fullStatusesFalse = await TaskStatus.find({isFinish: false});
            statusesFalse = await TaskStatus.find({isFinish: false}).select("_id");
            statusesTrue = await TaskStatus.find({isFinish: true}).select("_id");
            logDOs = await LogDO.find({});
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных Подразделения и Состояния заявок (current-state)",
                error: err
            });
        }

        // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false/true
        const idsFalse = statusesFalse.map(status => status._id);
        const idsTrue = statusesTrue.map(status => status._id);

        // Неназначенные заявки
        let unassignedTasks = 0;
        try {
            unassignedTasks = await getUnassignedTasks();
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении неназначенных заявок",
                error: err
            });
        }

        // Заявки в работе
        let inWorkTasks = 0;
        try {
            inWorkTasks = await getInWorkTasks(idsFalse);
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении заявок в работе",
                error: err
            });
        }

        // Не принятые заявки
        let notAccepted = 0;
        try {
            notAccepted = await getNotAccepted(idsTrue);
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении не принятых заявок",
                error: err
            });
        }

        // Загруженность подразделений
        let workloadDepartments = 0;
        try {
            workloadDepartments = await getWorkloadDepartments(fullStatusesFalse, departments);
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении загруженности подразделений",
                error: err
            });
        }

        // Динамика отказов
        const failureDynamics = getFailureDynamics(logDOs);

        // Среднее время реагирования
        let averageResponseTime = 0;
        try {
            averageResponseTime = await getAverageResponseTime();
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении среднего времени реагирования",
                error: err
            });
        }

        // Среднее время выполнения
        let averageClosingTime = 0;
        try {
            averageClosingTime = await getAverageClosingTime();
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении среднего времени выполнения",
                error: err
            });
        }

        // Изменение простоев
        const changeDowntime = await getChangeDowntime(logDOs, true);

        // Изменение отказов
        const changeRefusal = await getChangeDowntime(logDOs);

        // Рейтинг отказов за 12 месяцев (Топ-5)
        let bounceRating = [];
        try {
            bounceRating = await getBounceRating(equipment);
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении рейтинга отказов",
                error: err
            });
        }

        // Рейтинг незакрытых заявок (Топ-5)
        let ratingOrders = [];
        try {
            ratingOrders = await getRatingOrders(statusesFalse);
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении рейтинга незакрытых заявок",
                error: err
            });
        }

        // Отправляем ответ
        res.status(201).json({
            unassignedTasks,
            inWorkTasks,
            notAccepted,
            workloadDepartments,
            failureDynamics,
            averageResponseTime,
            averageClosingTime,
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

// Возвращает записи ЖДО при клике на "Неназначенные заявки"
router.get("/go-to-logDO/unassignedTasks", async (req, res) => {
    try {
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения

        // Даем запрос в бд, передавая фильтр и нужные даты
        await LogDO.find({responsible: null, state: null}, function (err, items) {
            // Обработка ошибки
            if (err)
                res.status(500).json({
                    message: "Возникла ошибка при получении записей из базы данных ЖДО (unassignedTasks)"
                });

            // Получаем начальную и конечную даты записей
            const startDate = moment(items[0].date).format(dateFormat);
            const endDate = moment(items[items.length - 1].date).format(dateFormat);

            // Получаем готовый массив записей ЖДО
            const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

            // Отправляем ответ
            res.status(201).json({itemsDto, startDate, endDate, alert: "Неназначенные заявки"});
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
                }
            )
            .populate("responsible")
            .populate("state")
            .populate("files");
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"})
    }
});

// Возвращает записи ЖДО при клике на "Заявки в работе"
router.get("/go-to-logDO/inWorkTasks", async (req, res) => {
    try {
        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
        await TaskStatus.find({isFinish: false}, async function (err, docs) {
            // Обработка ошибки
            if (err)
                res.status(500).json({
                    message: "Возникла ошибка при получении записей из базы данных Состояние заявок (inWorkTasks)"
                });

            // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false
            const ids = docs.map(doc => doc._id);

            await LogDO.find({state: {$in: ids}}, function (err, items) {
                // Обработка ошибки
                if (err)
                    res.status(500).json({
                        message: "Возникла ошибка при получении записей из базы данных ЖДО (inWorkTasks)"
                    });

                // Получаем начальную и конечную даты записей
                const startDate = moment(items[0].date).format(dateFormat);
                const endDate = moment(items[items.length - 1].date).format(dateFormat);

                // Получаем готовый массив записей ЖДО
                const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

                // Отправляем ответ
                res.status(201).json({itemsDto, startDate, endDate, alert: "Заявки в работе"});
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
                    }
                )
                .populate("responsible")
                .populate("state")
                .populate("files");
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"})
    }
});

// Возвращает записи ЖДО при клике на "Непринятые заявки"
router.get("/go-to-logDO/notAccepted", async (req, res) => {
    try {
        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
        await TaskStatus.find({isFinish: true}, async function (err, docs) {
            // Обработка ошибки
            if (err)
                res.status(500).json({
                    message: "Возникла ошибка при получении записей из базы данных Состояние заявок (notAccepted)"
                });

            // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = true
            const ids = docs.map(doc => doc._id);

            await LogDO.find(
                {$and: [{state: {$in: ids}}, {acceptTask: false}]},
                function (err, items) {
                    // Обработка ошибки
                    if (err)
                        res.status(500).json({
                            message: "Возникла ошибка при получении записей из базы данных ЖДО (notAccepted)"
                        });

                    // Получаем начальную и конечную даты записей
                    const startDate = moment(items[0].date).format(dateFormat);
                    const endDate = moment(items[items.length - 1].date).format(dateFormat);

                    // Получаем готовый массив записей ЖДО
                    const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

                    // Отправляем ответ
                    res.status(201).json({itemsDto, startDate, endDate, alert: "Непринятые заявки"});
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
                    }
                )
                .populate("responsible")
                .populate("state")
                .populate("files");
        })
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

        // Выполняем поиск в базе данных "TaskStatus" по полю "name"
        await TaskStatus.find({name: state}, async function (err, docs) {
            // Обработка ошибки
            if (err)
                res.status(500).json({
                    message: "Возникла ошибка при получении записей из базы данных Состояние заявки (bar)"
                });

            // Формируем массив удовлетворяющих записей с идентификатором (_id), где name = state
            const idsTasks = docs.map(doc => doc._id);

            // Выполняем поиск в базе данных "Department" по полю "name"
            await Department.find({name: department}, async function (err, docs) {
                // Обработка ошибки
                if (err)
                    res.status(500).json({
                        message: "Возникла ошибка при получении записей из базы данных Подразделения (bar)"
                    });

                // Формируем массив удовлетворяющих записей с идентификатором (_id), где name = department
                const idsDepartments = docs.map(doc => doc._id);

                await LogDO.find(
                    {$and: [{state: {$in: idsTasks}}, {department: {$in: idsDepartments}}]},
                    function (err, items) {
                        // Обработка ошибки
                        if (err)
                            res.status(500).json({
                                message: "Возникла ошибка при получении записей из базы данных ЖДО (bar)"
                            });

                        // Получаем начальную и конечную даты записей
                        const startDate = moment(items[0].date).format(dateFormat);
                        const endDate = moment(items[items.length - 1].date).format(dateFormat);

                        // Получаем готовый массив записей ЖДО
                        const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

                        // Отправляем ответ
                        res.status(201).json({itemsDto, startDate, endDate, alert: "Гистограмма"});
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
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО"})
    }
});

// Возвращает записи ЖДО при клике на линейную диаграмму
router.post("/go-to-logDO/line", async (req, res) => {
    try {
        const {fullDate} = req.body;   // Извлекаем объект из тела запроса

        // Перевод выбранной даты в миллисекунды
        const millisecondsStart = moment(fullDate).startOf("day").valueOf();
        const millisecondsEnd = moment(fullDate).endOf("day").valueOf();

        const departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        const equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование

        // Даем запрос в бд, передавая фильтр и нужные даты
        await LogDO.find(
            {date: {$gte: millisecondsStart, $lte: millisecondsEnd}},
            function (err, items) {
                // Обработка ошибки
                if (err)
                    res.status(500).json({
                        message: "Возникла ошибка при получении записей из базы данных ЖДО (line)"
                    });

                // Получаем начальную и конечную даты записей
                const startDate = moment(items[0].date).format(dateFormat);
                const endDate = moment(items[items.length - 1].date).format(dateFormat);

                // Получаем готовый массив записей ЖДО
                const itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

                // Отправляем ответ
                res.status(201).json({itemsDto, startDate, endDate, alert: "Динамика отказов"});
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
            function (err, items) {
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
                res.status(201).json({itemsDto, startDate, endDate, alert: "Рейтинг отказов за 12 месяцев (Топ-5)"});
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
        let departments;
        try {
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных Подразделения (ratingOrders)",
                error: err
            });
            console.log(err);
        }

        let equipment;
        try {
            equipment = await Equipment.find({}).populate("parent");   // Получаем всё оборудование
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных Оборудование (ratingOrders)",
                error: err
            });
            console.log(err);
        }

        let statuses;
        try {
            // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
            statuses = await TaskStatus.find({isFinish: false}).select("_id");
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных Состояние заявки (ratingOrders)",
                error: err
            });
            console.log(err);
        }

        // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false
        const ids = statuses.map(status => status._id);

        let items;
        try {
            // Выполняем поиск в базе данных "LogDO" по полю "state"
            items = await LogDO.find(
                {$or: [{state: {$in: ids}}, {state: null}]})
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
                .populate("state")
                .populate("files");
        } catch (err) {
            res.status(500).json({
                message: "Возникла ошибка при получении записей из базы данных ЖДО (ratingOrders)",
                error: err
            });
            console.log(err);
        }

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
        res.status(201).json({itemsDto, startDate, endDate, alert: "Рейтинг незакрытых заявок (Топ-5)"});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Возникла ошибка при переходе в раздел ЖДО",
            error: err
        });
    }
});

module.exports = router;