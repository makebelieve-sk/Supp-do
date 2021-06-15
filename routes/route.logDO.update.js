// Маршруты для обновления дат раздела "Журнала дефектов и отказов" в демо режиме
const moment = require("moment");
const {Router} = require("express");

const LogDO = require("../schemes/LogDO");
const Department = require("../schemes/Department");
const Equipment = require("../schemes/Equipment");
const LogDoDto = require("../dto/LogDoDto");
const TaskStatus = require("../schemes/TaskStatus");

const router = Router();
const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Обновляем даты у записей в режиме "demo"
router.post("/:date", async (req, res) => {
    try {
        const currentDate = req.params.date;     // Получаем дату "с"
        const {dateStart, dateEnd} = req.body;

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        // Получаем все записи ЖДО с фильтром по дате
        const logDOs = await LogDO
            .find({})
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

        if (logDOs && logDOs.length) {
            // Получаем разницу между текущей датой и датой создания последней записи
            const diff = moment(currentDate, dateFormat).diff(moment(logDOs[0].date, dateFormat));

            logDOs.forEach(logDO => {
                logDO.date = moment(logDO.date, dateFormat).valueOf() + diff;
                logDO.planDateDone = logDO.planDateDone ? moment(logDO.planDateDone, dateFormat).valueOf() + diff : null;
                logDO.dateDone = logDO.dateDone ? moment(logDO.dateDone, dateFormat).valueOf() + diff : null;

                logDO.save();
            });
        }

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
            return res.status(500).json({message: "Возникла ошибка при получении записей из базы данных 'Журнал дефектов и отказов' (/logDO/dto)"});
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

        return res.status(200).json({message: "Даты записей успешно обновлены", itemsDto, statusLegend});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при обновлении дат записей: ${err}`});
    }
});


module.exports = router;