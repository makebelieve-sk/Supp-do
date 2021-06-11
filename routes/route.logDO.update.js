// Маршруты для обновления дат раздела "Журнала дефектов и отказов" в демо режиме
const moment = require("moment");
const {Router} = require("express");

const LogDO = require("../schemes/LogDO");

const router = Router();
const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Обновляем даты у записей в режиме "demo"
router.get("/:date", async (req, res) => {
    try {
        const currentDate = req.params.date;     // Получаем дату "с"

        // Получаем все записи ЖДО с фильтром по дате
        const items = await LogDO.find({}).sort({date: -1});

        if (items && items.length) {
            // Получаем разницу между текущей датой и датой создания последней записи
            const diff = moment(currentDate, dateFormat).diff(moment(items[0].date, dateFormat));

            items.forEach(logDO => {
                logDO.date = moment(logDO.date, dateFormat).valueOf() + diff;
                logDO.planDateDone = logDO.planDateDone ? moment(logDO.planDateDone, dateFormat).valueOf() + diff : null;
                logDO.dateDone = logDO.dateDone ? moment(logDO.dateDone, dateFormat).valueOf() + diff : null;

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