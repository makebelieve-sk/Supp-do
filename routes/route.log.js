// Маршруты для раздела "Журнал действий пользователей"
const moment = require("moment");
const {Router} = require("express");

const Log = require("../schemes/Log");
const LogDto = require("../dto/LogDto");

const router = Router();

const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Возвращает запись по коду
router.get("/logs/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        let item;

        item = await Log.findById({_id});  // Получение существующей записи

        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json(item);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи: ${err}`});
    }
});

// Возвращает все записи за период
router.get("/logs/:dateStart/:dateEnd", async (req, res) => {
    try {
        const dateStart = req.params.dateStart;     // Получаем дату "с"
        const dateEnd = req.params.dateEnd;         // Получаем дату "по"

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        const items = await Log.find({date: {$gte: millisecondsStart, $lte: millisecondsEnd}}).sort({date: -1});  // Получаем все записи

        let itemsDto = [];

        // Изменяем запись для вывода в таблицу
        if (items && items.length) itemsDto = items.map(item => new LogDto(item));

        res.status(200).json(itemsDto);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Удаляет записи за период
router.delete("/logs/:dateStart/:dateEnd", async (req, res) => {
    try {
        const dateStart = req.params.dateStart;     // Получаем дату "с"
        const dateEnd = req.params.dateEnd;         // Получаем дату "по"

        // Рассчитываем количество миллисекунд для дат "с" и "по"
        const millisecondsStart = moment(dateStart, dateFormat).valueOf();
        const millisecondsEnd = moment(dateEnd, dateFormat).valueOf();

        const items = await Log.find({date: {$gte: millisecondsStart, $lte: millisecondsEnd}});  // Получаем все записи

        let logsId = [];

        // Изменяем запись для вывода в таблицу
        for (let i = 0; i < items.length; i++) {
            logsId.push(items[i]._id);

            const item = await Log.findById({_id: items[i]._id});  // Ищем текущую запись

            if (item) {
                await Log.deleteOne({_id: items[i]._id});    // Удаление записи из базы данных по id записи
            } else {
                res.status(404).json({message: `Удаление может быть завершено некорректно, т.к. запись c id: ${items[i]._id} уже была удалена`});
            }
        }

        res.status(200).json({message: "Записи успешно удалены", logsId});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при удалении записей за выбранный период: " + err});
    }
});

// Удаляет запись
router.delete("/logs/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        const item = await Log.findById({_id});  // Ищем текущую запись

        if (item) {
            await Log.deleteOne({_id});    // Удаление записи из базы данных по id записи
            return res.status(200).json({message: "Запись успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи: ${err}`});
    }
});

module.exports = router;