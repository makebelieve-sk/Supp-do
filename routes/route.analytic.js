const {Router} = require("express");
const router = Router();
const moment = require("moment");
const Department = require("../schemes/Department");
const Equipment = require("../schemes/Equipment");
const TaskStatus = require("../schemes/TaskStatus");
const LogDO = require("../schemes/LogDO");

const dateFormat = "DD.MM.YYYY HH:mm";  // Определяем формат даты
moment.locale("ru");

router.get("/current-state", async (req, res) => {
    try {
        const currentDate = moment().valueOf();                                 // Количество миллисекунд до "сейчас"
        const prevYear = moment().subtract(1, "year").valueOf();    // Кол-во мс до прошлого года

        const departments = await Department.find({});
        const equipment = await Equipment.find({});
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
                            if (logDO.department && logDO.state) {
                                return logDO.department.name === department.name && logDO.state.name === task.name;
                            }
                        })

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
                if (logDO.dateDone && logDO.planDateDone) {
                    i++;

                    averageResponseTime += moment(logDO.dateDone, dateFormat).valueOf() - moment(logDO.planDateDone, dateFormat).valueOf();
                }
            });

            const hours = Math.floor(Math.abs(averageResponseTime) / i / 1000 / 60 / 60);     // Находим часы
            const minutes = Math.floor(Math.abs(averageResponseTime) / i / 1000 / 60 % 60);   // Находим минуты

            if (hours === 0) {
                averageResponseTime = minutes;
            } else if (hours.toString().length >= 3) {
                averageResponseTime = (Math.abs(averageResponseTime) / i / 1000 / 60 / 60 / 24).toFixed(1);
            } else {
                averageResponseTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
            }

            const millisecondsInDay = 86400000; // Количество миллисекунд в одном дне

            // Динамика отказов
            for (let i = moment().subtract(1, "month").add(1, "day").valueOf(); i < moment().valueOf(); i += millisecondsInDay) {
                let value = 0;

                logDOs.forEach(logDO => {
                    if (moment(logDO.date).date() === moment(i).date()
                        && moment(logDO.date).month() === moment(i).month()
                        && moment(logDO.date).year() === moment(i).year()
                    ) {
                        value += 1;
                    }
                })

                const lineChartObject = {
                    date: moment(i).date().toString(),
                    value: value.toString()
                };

                failureDynamics.push(lineChartObject);
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
            const countLogs = logDOs.filter(logDO => logDO.state && !logDO.state.isFinish);

            if (countLogs && countLogs.length) {
                countLogs.forEach(logDO => {
                    ratingOrders.push({
                        id: logDO._id,
                        name: logDO.equipment.name,
                        value: ((moment().valueOf() - moment(logDO.date).valueOf()) / 1000 / 60 / 60 / 24)
                            .toFixed(1)
                    });
                });

                ratingOrders.sort((a, b) => a.value < b.value ? 1 : -1);
                ratingOrders.splice(5);
            }
        }

        res.status(201).json({
            unassignedTasks,
            inWorkTasks,
            notAccepted,
            workloadDepartments,
            averageResponseTime,
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

router.post("/current-state", async (req, res) => {
    try {
        const {} = req.body.params;

        const currentDate = moment().valueOf();                                 // Количество миллисекунд до "сейчас"
        const prevYear = moment().subtract(1, "year").valueOf();    // Кол-во мс до прошлого года

        const departments = await Department.find({});
        const equipment = await Equipment.find({});
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
                            if (logDO.department && logDO.state) {
                                return logDO.department.name === department.name && logDO.state.name === task.name;
                            }
                        })

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
                if (logDO.dateDone && logDO.planDateDone) {
                    i++;

                    averageResponseTime += moment(logDO.dateDone, dateFormat).valueOf() - moment(logDO.planDateDone, dateFormat).valueOf();
                }
            });

            const hours = Math.floor(Math.abs(averageResponseTime) / i / 1000 / 60 / 60);     // Находим часы
            const minutes = Math.floor(Math.abs(averageResponseTime) / i / 1000 / 60 % 60);   // Находим минуты

            if (hours === 0) {
                averageResponseTime = minutes;
            } else if (hours.toString().length >= 3) {
                averageResponseTime = (Math.abs(averageResponseTime) / i / 1000 / 60 / 60 / 24).toFixed(1);
            } else {
                averageResponseTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
            }

            const millisecondsInDay = 86400000; // Количество миллисекунд в одном дне

            // Динамика отказов
            for (let i = moment().subtract(1, "month").add(1, "day").valueOf(); i < moment().valueOf(); i += millisecondsInDay) {
                let value = 0;

                logDOs.forEach(logDO => {
                    if (moment(logDO.date).date() === moment(i).date()
                        && moment(logDO.date).month() === moment(i).month()
                        && moment(logDO.date).year() === moment(i).year()
                    ) {
                        value += 1;
                    }
                })

                const lineChartObject = {
                    date: moment(i).date().toString(),
                    value: value.toString()
                };

                failureDynamics.push(lineChartObject);
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
            const countLogs = logDOs.filter(logDO => logDO.state && !logDO.state.isFinish);

            if (countLogs && countLogs.length) {
                countLogs.forEach(logDO => {
                    ratingOrders.push({
                        id: logDO._id,
                        name: logDO.equipment.name,
                        value: ((moment().valueOf() - moment(logDO.date).valueOf()) / 1000 / 60 / 60 / 24)
                            .toFixed(1)
                    });
                });

                ratingOrders.sort((a, b) => a.value < b.value ? 1 : -1);
                ratingOrders.splice(5);
            }
        }

        res.status(201).json({
            unassignedTasks,
            inWorkTasks,
            notAccepted,
            workloadDepartments,
            averageResponseTime,
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

module.exports = router;