// Маршруты для обновления дат раздела "Журнала дефектов и отказов" в демо режиме
const moment = require("moment");
const {Router} = require("express");

const LogDO = require("../schemes/LogDO");

const router = Router();
const dateFormat = "DD.MM.YYYY HH:mm";  // Константа формата даты

// Обновляем даты у записей в режиме "demo"
router.get("/", async (req, res) => {
    try {
        const currentDate = moment().format(dateFormat);     // Получаем дату "с"

        const items = await LogDO.find({}).sort({date: -1});

        if (items && items.length) {
            // Получаем разницу между текущей датой и датой создания последней записи
            const diff = moment(currentDate, dateFormat).diff(moment(items[0].date, dateFormat));

            for (let i = 0; i < items.length; i++) {
                // Обновляем поля записи
                await LogDO.updateOne(
                    {_id: items[i]._id},
                    {
                        $set: {
                            date : moment(items[i].date, dateFormat).valueOf() + diff,
                            planDateDone: items[i].planDateDone ? moment(items[i].planDateDone, dateFormat).valueOf() + diff : null,
                            dateDone: items[i].dateDone ? moment(items[i].dateDone, dateFormat).valueOf() + diff : null,
                        }
                    }
                );
            }
        }

        return res.status(200).json("Даты записей успешно обновлены");
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при обновлении дат записей: ${err}`});
    }
});


module.exports = router;