// Маршруты для раздела "Аналитика"
const {Router} = require("express");
const moment = require("moment");

const Department = require("../schemes/Department");
const Equipment = require("../schemes/Equipment");
const TaskStatus = require("../schemes/TaskStatus");
const LogDO = require("../schemes/LogDO");
const LogDoDto = require("../dto/LogDoDto");

const router = Router();

const dateFormat = "DD.MM.YYYY HH:mm";  // Устанавливаем формат времени
moment.locale("ru");            // Русифицируем библиотеку moment

/**
 * Функция преобразования миллисекунд в сек/мин/сут
 * @param result - среднее значение времени
 * @param count - количество записей
 * @returns string - возвращаем строку
 */
const transformTime = (result, count) => {
    if (result) {
        const hours = Math.floor(result / count / 1000 / 60 / 60);     // Находим часы
        const minutes = Math.floor(result / count / 1000 / 60 % 60);   // Находим минуты

        // Форматируем конечное значение
        if (hours === 0) {
            result = minutes;
        } else if (hours.toString().length >= 3) {
            result = (result / count / 1000 / 60 / 60 / 24).toFixed(1);
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
        return await LogDO.find({responsible: null, taskStatus: null}).countDocuments();
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
            .find({$and: [{taskStatus: {$ne: null}, responsible: {$ne: null}}, {taskStatus: {$in: ids}}]})
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
            .find({$and: [{taskStatus: {$ne: null}, acceptTask: false}, {taskStatus: {$in: ids}}]})
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
            .find({$and: [{department: {$ne: null}}, {taskStatus: {$ne: null}}, {taskStatus: {$in: tasks}}]})
            .populate("taskStatus")
            .populate("department");

        if (departments && departments.length && tasks && tasks.length) {
            departments.forEach(department => {
                tasks.forEach(task => {
                    // Фильтруем подходящие записи
                    const currentRecords = logDOs.filter(logDO =>
                        logDO.department && logDO.taskStatus && logDO.department.name === department.name &&
                        logDO.taskStatus.name === task.name);

                    if (currentRecords && currentRecords.length) {
                        // Пушим объект
                        result.push({
                            department: department.name,
                            taskStatus: task.name,
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

    for (let i = start; i <= end; i += millisecondsInDay) {
        let value = 0;

        // Форматируем месяц в формат 'mm' из 'm'
        const month = moment(i).month().toString().length === 1 ? `0${+moment(i).month() + 1}` : +moment(i).month() + 1;

        logDOs.forEach(logDO => {
            if (moment(logDO.date).date() === moment(i).date()
                && moment(logDO.date).month() === moment(i).month()
                && moment(logDO.date).year() === moment(i).year()
            ) value += 1;
        });

        result.push({
            date: moment(i).date() + "." + month,
            value: value,
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
            .select("chooseResponsibleTime");

        logDOs.forEach(logDO => result += +logDO.chooseResponsibleTime);

        return transformTime(result, logDOs.length);
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

        return transformTime(result, logDOs.length);
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
const getChangeDowntime = (logDOs, flag) => {
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
                value: downtimePrevYear,
                monthNumber: moment().month() + 1
            },
            {
                month: moment().subtract(2, "month").format("MMMM")[0].toUpperCase()
                    + moment().subtract(2, "month").format("MMMM").slice(1, 3) + ". "
                    + moment().format("YYYY"),
                value: downtimePrevTwoMonth,
                monthNumber: moment().subtract(2, "month").month() + 1
            },
            {
                month: moment().subtract(1, "month").format("MMMM")[0].toUpperCase()
                    + moment().subtract(1, "month").format("MMMM").slice(1, 3) + ". "
                    + moment().format("YYYY"),
                value: downtimePrevMonth,
                monthNumber: moment().subtract(1, "month").month() + 1
            },
            {
                month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                    + moment().format("YYYY"),
                value: downtimeCurrentMonth,
                monthNumber: moment().month() + 1
            },
        ]
        : [
            {
                month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                    + moment().subtract(1, "year").format("YYYY"),
                value: prevYearLogDOs.length,
                monthNumber: moment().month() + 1
            },
            {
                month: moment().subtract(2, "month").format("MMMM")[0].toUpperCase()
                    + moment().subtract(2, "month").format("MMMM").slice(1, 3) + ". "
                    + moment().format("YYYY"),
                value: prevTwoMonthLogDOs.length,
                monthNumber: moment().subtract(2, "month").month() + 1
            },
            {
                month: moment().subtract(1, "month").format("MMMM")[0].toUpperCase()
                    + moment().subtract(1, "month").format("MMMM").slice(1, 3) + ". "
                    + moment().format("YYYY"),
                value: prevMonthLogDOs.length,
                monthNumber: moment().subtract(1, "month").month() + 1
            },
            {
                month: moment().format("MMMM")[0].toUpperCase() + moment().format("MMMM").slice(1, 3) + ". "
                    + moment().format("YYYY"),
                value: currentMonthLogDOs.length,
                monthNumber: moment().month() + 1
            },
        ];
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
            // Количество миллисекунд до "сейчас"/до прошлого года
            const currentDate = moment().valueOf();
            const prevYear = moment().subtract(1, "year").valueOf();

            await LogDO
                .find(
                    {$and: [{equipment: eq._id.toString()}, {date: {$gte: prevYear, $lte: currentDate}}]},
                    (err, docs) => result.push({id: eq._id, name: eq.name, value: docs ? docs.length : 0})
                );
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
            .find({$or: [{taskStatus: null}, {taskStatus: {$in: ids}}]})
            .populate("equipment");

        if (logDOs && logDOs.length) {
            logDOs.forEach(logDO => {
                result.push({
                    id: logDO._id,
                    name: logDO.equipment ? logDO.equipment.name : "",
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
router.get("/analytic", async (req, res) => {
    try {
        let departments = [], equipment = [], fullStatusesFalse = [], statusesFalse = [], statusesTrue = [], logDOs = [];

        try {
            departments = await Department.find({});
            equipment = await Equipment.find({});
            fullStatusesFalse = await TaskStatus.find({isFinish: false});
            statusesFalse = await TaskStatus.find({isFinish: false}).select("_id");
            statusesTrue = await TaskStatus.find({isFinish: true}).select("_id");
            logDOs = await LogDO.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения', 'Состояния заявок' и 'Оборудование' (analytic)"
            });
        }

        let idsFalse = [], idsTrue = [];

        // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false/true
        if (statusesFalse) idsFalse = statusesFalse.map(status => status._id);
        if (statusesTrue) idsTrue = statusesTrue.map(status => status._id);

        // Неназначенные заявки
        let unassignedTasks = 0;
        try {
            unassignedTasks = await getUnassignedTasks();
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении неназначенных заявок: " + err});
        }

        // Заявки в работе
        let inWorkTasks = 0;
        try {
            inWorkTasks = await getInWorkTasks(idsFalse);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении заявок в работе: " + err});
        }

        // Не принятые заявки
        let notAccepted = 0;
        try {
            notAccepted = await getNotAccepted(idsTrue);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении не принятых заявок: " + err});
        }

        // Загруженность подразделений
        let workloadDepartments = 0;
        try {
            workloadDepartments = await getWorkloadDepartments(fullStatusesFalse, departments);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении загруженности подразделений: " + err});
        }

        // Динамика отказов
        const failureDynamics = getFailureDynamics(logDOs);

        // Среднее время реагирования
        let averageResponseTime = 0;
        try {
            averageResponseTime = await getAverageResponseTime();
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении среднего времени реагирования: " + err});
        }

        // Среднее время выполнения
        let averageClosingTime = 0;
        try {
            averageClosingTime = await getAverageClosingTime();
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении среднего времени выполнения: " + err});
        }

        // Изменение простоев
        const changeDowntime = getChangeDowntime(logDOs, true);

        // Изменение отказов
        const changeRefusal = getChangeDowntime(logDOs);

        // Рейтинг отказов за 12 месяцев (Топ-5)
        let bounceRating = [];
        try {
            bounceRating = await getBounceRating(equipment);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении рейтинга отказов: " + err});
        }

        // Рейтинг незакрытых заявок (Топ-5)
        let ratingOrders = [];
        try {
            ratingOrders = await getRatingOrders(statusesFalse);
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении рейтинга незакрытых заявок: " + err});
        }

        // Отправляем ответ
        res.status(200).json({
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
router.get("/logDO/unassignedTasks", async (req, res) => {
    try {
        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (unassignedTasks): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Даем запрос в бд, передавая фильтр и нужные даты
        await LogDO.find({responsible: null, taskStatus: null}, function (err, items) {
            // Обработка ошибки
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Возникла ошибка при получении записей из базы данных ЖДО (unassignedTasks): " + err
                });
            }

            let startDate = null, endDate = null, statusLegend = [], itemsDto = [];

            if (items && items.length) {
                // Получаем начальную и конечную даты записей
                startDate = moment(items[items.length - 1].date).format(dateFormat);
                endDate = moment(items[0].date).format(dateFormat);

                // Получаем готовый массив записей ЖДО
                itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                            borderColor: "#d9d9d9"
                        });
                }
            }

            // Отправляем ответ
            res.status(200).json({
                itemsDto,
                startDate,
                endDate,
                alert: "Неназначенные заявки",
                statusLegend
            });
        })
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
                }
            )
            .populate("responsible")
            .populate("taskStatus")
            .populate("files");
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО при клике на 'Неназначенные заявки' " + err});
    }
});

// Возвращает записи ЖДО при клике на "Заявки в работе"
router.get("/logDO/inWorkTasks", async (req, res) => {
    try {
        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (inWorkTasks): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
        await TaskStatus.find({isFinish: false}, async function (err, docs) {
            // Обработка ошибки
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Возникла ошибка при получении записей из базы данных Состояние заявок (inWorkTasks) " + err
                });
            }

            // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false
            const ids = docs.map(doc => doc._id);

            await LogDO.find({taskStatus: {$in: ids}, responsible: {$ne: null}}, async function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        message: "Возникла ошибка при получении записей из базы данных ЖДО (inWorkTasks) " + err
                    });
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[items.length - 1].date).format(dateFormat);
                    endDate = moment(items[0].date).format(dateFormat);

                    // Получаем готовый массив записей ЖДО
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                borderColor: "#d9d9d9"
                            });
                    }
                }

                // Отправляем ответ
                res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: "Заявки в работе",
                    statusLegend
                });
            })
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
                    }
                )
                .populate("responsible")
                .populate("taskStatus")
                .populate("files");
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО при клике на 'Заявки в работе' " + err});
    }
});

// Возвращает записи ЖДО при клике на "Непринятые заявки"
router.get("/logDO/notAccepted", async (req, res) => {
    try {
        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (notAccepted): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
        await TaskStatus.find({isFinish: true}, async function (err, docs) {
            // Обработка ошибки
            if (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных Состояние заявок (notAccepted) " + err});
            }

            // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = true
            const ids = docs.map(doc => doc._id);

            await LogDO.find(
                {$and: [{taskStatus: {$in: ids}}, {acceptTask: false}]},
                function (err, items) {
                    // Обработка ошибки
                    if (err) {
                        console.log(err);
                        res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (notAccepted) " + err});
                    }

                    let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                    if (items && items.length) {
                        // Получаем начальную и конечную даты записей
                        startDate = moment(items[items.length - 1].date).format(dateFormat);
                        endDate = moment(items[0].date).format(dateFormat);

                        // Получаем готовый массив записей ЖДО
                        itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                    borderColor: "#d9d9d9"
                                });
                        }
                    }

                    // Отправляем ответ
                    res.status(200).json({
                        itemsDto,
                        startDate,
                        endDate,
                        alert: "Непринятые заявки",
                        statusLegend
                    });
                })
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
                    }
                )
                .populate("responsible")
                .populate("taskStatus")
                .populate("files");
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на гистограмму
router.post("/logDO/bar", async (req, res) => {
    try {
        const {department, taskStatus} = req.body;   // Извлекаем объект из тела запроса

        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (bar): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Выполняем поиск в базе данных "TaskStatus" по полю "name"
        await TaskStatus.find({name: taskStatus}, async function (err, docs) {
            // Обработка ошибки
            if (err) {
                console.log(err);
                res.status(500).json({message: "Возникла ошибка при получении записей из базы данных Состояние заявки (bar) " + err});
            }

            // Формируем массив удовлетворяющих записей с идентификатором (_id), где name = taskStatus
            const idsTasks = docs.map(doc => doc._id);

            // Выполняем поиск в базе данных "Department" по полю "name"
            await Department.find({name: department}, async function (err, docs) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    res.status(500).json({message: "Возникла ошибка при получении записей из базы данных Подразделения (bar) " + err});
                }

                // Формируем массив удовлетворяющих записей с идентификатором (_id), где name = department
                const idsDepartments = docs.map(doc => doc._id);

                await LogDO.find(
                    {$and: [{taskStatus: {$in: idsTasks}}, {department: {$in: idsDepartments}}]},
                    function (err, items) {
                        // Обработка ошибки
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (bar) " + err});
                        }

                        let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                        if (items && items.length) {
                            // Получаем начальную и конечную даты записей
                            startDate = moment(items[items.length - 1].date).format(dateFormat);
                            endDate = moment(items[0].date).format(dateFormat);

                            // Получаем готовый массив записей ЖДО
                            itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                        borderColor: "#d9d9d9"
                                    });
                            }
                        }

                        // Отправляем ответ
                        res.status(200).json({
                            itemsDto,
                            startDate,
                            endDate,
                            alert: "Загруженность подразделений",
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
                        }
                    )
                    .populate("responsible")
                    .populate("taskStatus")
                    .populate("files");
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на линейную диаграмму
router.post("/logDO/line", async (req, res) => {
    try {
        const {fullDate} = req.body;   // Извлекаем объект из тела запроса

        // Перевод выбранной даты в миллисекунды
        const millisecondsStart = moment(fullDate).startOf("day").valueOf();
        const millisecondsEnd = moment(fullDate).endOf("day").valueOf();

        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (line): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Даем запрос в бд, передавая фильтр и нужные даты
        await LogDO.find(
            {date: {$gte: millisecondsStart, $lte: millisecondsEnd}},
            function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (line) " + err});
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[items.length - 1].date).format(dateFormat);
                    endDate = moment(items[0].date).format(dateFormat);

                    // Получаем готовый массив записей ЖДО
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                borderColor: "#d9d9d9"
                            });
                    }
                }

                // Отправляем ответ
                res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: "Динамика отказов",
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
                }
            )
            .populate("responsible")
            .populate("taskStatus")
            .populate("files");
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на "Рейтинг отказов за 12 месяцев"
router.get("/logDO/rating/bounceRating", async (req, res) => {
    try {
        // Рассчитываем количество миллисекунд до предыдущего года
        const prevYearMilliseconds = moment().subtract(1, "year").valueOf();

        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (bounceRating): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Даем запрос в бд, передавая нужную дату
        await LogDO.find(
            {
                equipment: {$ne: null},
                date: {$gte: prevYearMilliseconds, $lte: moment().valueOf()}
            },
            function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (bounceRating) " + err});
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[items.length - 1].date).format(dateFormat);
                    endDate = moment(items[0].date).format(dateFormat);

                    // Сортируем записи по полю "Оборудование.Наименование"
                    items = items.sort((a, b) => {
                        if (a.equipment && b.equipment)
                            return a.equipment.name < b.equipment.name ? 1 : -1;
                    });

                    // Сортируем записи в порядке убывания по полю "Оборудование"
                    items = items.sort((a, b) => {
                        const countA = items.filter(logDO => {
                            if (logDO.equipment && a.equipment)
                                return logDO.equipment._id.toString() === a.equipment._id.toString();
                        });

                        const countB = items.filter(logDO => {
                            if (logDO.equipment && b.equipment)
                                return logDO.equipment._id.toString() === b.equipment._id.toString();
                        });

                        return countA.length < countB.length ? 1 : -1;
                    });

                    // Получаем массив записей ЖДО
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                borderColor: "#d9d9d9"
                            });
                    }
                }

                // Отправляем ответ
                res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: "Рейтинг отказов за 12 месяцев (Топ-5)",
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
                }
            )
            .populate("responsible")
            .populate("taskStatus")
            .populate("files");
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на "Рейтинг незакрытых заявок"
router.get("/logDO/rating/ratingOrders", async (req, res) => {
    try {
        let departments = [];
        try {
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Подразделения' (ratingOrders) " + err});
        }

        let equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");   // Получаем всё оборудование
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Оборудование' (ratingOrders) " + err});
        }

        // Получаем все записи состояний заявок
        let allStatuses = [];

        try {
            allStatuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        let statuses = [];
        try {
            // Выполняем поиск в базе данных "TaskStatus" по полю "isFinish"
            statuses = await TaskStatus.find({isFinish: false}).select("_id");
        } catch (err) {
            console.log(err);
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных Состояние заявки (ratingOrders) " + err});
        }

        // Формируем массив удовлетворяющих записей с идентификатором (_id), где isFinish = false
        const ids = statuses.map(status => status._id);

        let items;
        try {
            // Выполняем поиск в базе данных "LogDO" по полю "taskStatus"
            items = await LogDO.find(
                {$or: [{taskStatus: {$in: ids}}, {taskStatus: null}]})
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
            res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (ratingOrders) " + err});
        }

        let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

        if (items && items.length) {
            // Получаем начальную и конечную даты записей
            startDate = moment(items[items.length - 1].date).format(dateFormat);
            endDate = moment(items[0].date).format(dateFormat);

            // Сортируем записи в порядке убывания по незавершенному статусу заявки
            items = items.sort((a, b) => {
                const firstDiff = moment().valueOf() - moment(a.date).valueOf();
                const secondDiff = moment().valueOf() - moment(b.date).valueOf();

                return firstDiff - secondDiff > 0 ? -1 : 1;
            });

            // Получаем готовый массив записей ЖДО
            itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

            if (allStatuses && allStatuses.length) {
                allStatuses.forEach(task => {
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
                        borderColor: "#d9d9d9"
                    });
            }
        }

        // Отправляем ответ
        res.status(200).json({
            itemsDto,
            startDate,
            endDate,
            alert: "Рейтинг незакрытых заявок (Топ-5)",
            statusLegend
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на "Продолжительность простоев, мин"
router.post("/logDO/column/downtime", async (req, res) => {
    try {
        const {monthNumber} = req.body;

        const dateStart = moment().month(monthNumber - 1).startOf("month").valueOf();
        const dateEnd = moment().month(monthNumber - 1).endOf("month").valueOf();

        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (bounceRating): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Даем запрос в бд, передавая нужную дату
        await LogDO.find(
            {date: {$gte: dateStart, $lte: dateEnd}, downtime: {$ne: ""}},
            function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    return res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (bounceRating) " + err});
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[items.length - 1].date).format(dateFormat);
                    endDate = moment(items[0].date).format(dateFormat);

                    // Сортируем записи по полю "Простои"
                    items = items.sort((a, b) => {
                        a.downtime = a.downtime ? a.downtime : 0;
                        b.downtime = b.downtime ? b.downtime : 0;

                        return a.downtime < b.downtime ? 1 : -1;
                    });

                    // Получаем массив записей ЖДО
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                borderColor: "#d9d9d9"
                            });
                    }
                }

                // Отправляем ответ
                return res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: "Продолжительность простоев, мин",
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
                }
            )
            .populate("responsible")
            .populate("taskStatus")
            .populate("files");
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

// Возвращает записи ЖДО при клике на "Количество отказов, шт."
router.post("/logDO/column/failure", async (req, res) => {
    try {
        const {monthNumber} = req.body;

        const dateStart = moment().month(monthNumber - 1).startOf("month").valueOf();
        const dateEnd = moment().month(monthNumber - 1).endOf("month").valueOf();

        let departments = [], equipment = [];
        try {
            equipment = await Equipment.find({}).populate("parent");      // Получаем всё оборудование
            departments = await Department.find({}).populate("parent");   // Получаем все подразделения
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                message: "Возникла ошибка при получении записей из баз данных 'Подразделения' и 'Оборудование' (bounceRating): " + err
            });
        }

        // Получаем все записи состояний заявок
        let statuses = [];

        try {
            statuses = await TaskStatus.find({});
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Состояния заявок' (/logDO/dto)"});
        }

        // Даем запрос в бд, передавая нужную дату
        await LogDO.find(
            {date: {$gte: dateStart, $lte: dateEnd}},
            function (err, items) {
                // Обработка ошибки
                if (err) {
                    console.log(err);
                    return res.status(500).json({message: "Возникла ошибка при получении записей из базы данных ЖДО (bounceRating) " + err});
                }

                let startDate = null, endDate = null, itemsDto = [], statusLegend = [];

                if (items && items.length) {
                    // Получаем начальную и конечную даты записей
                    startDate = moment(items[items.length - 1].date).format(dateFormat);
                    endDate = moment(items[0].date).format(dateFormat);

                    // Получаем массив записей ЖДО
                    itemsDto = items.map(item => new LogDoDto(item, departments, equipment));

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
                                borderColor: "#d9d9d9"
                            });
                    }
                }

                // Отправляем ответ
                return res.status(200).json({
                    itemsDto,
                    startDate,
                    endDate,
                    alert: "Количество отказов, шт.",
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
                }
            )
            .populate("responsible")
            .populate("taskStatus")
            .populate("files");
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Возникла ошибка при переходе в раздел ЖДО " + err});
    }
});

module.exports = router;