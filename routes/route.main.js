// Маршрут для получения файла настроек приложения
const {Router} = require("express");
const config = require("../config/default.json");

const router = Router();

// Возвращает содержимое файла настроек
router.get("/config", async (req, res) => {
    try {
        const {mode, timeToUpdateDates} = config;  // Разворачиваем объект настроек проекта

        // Инициализируем константы
        const MODE = process.env.MODE || mode;
        const TIME_TO_UPDATE_DATES = process.env.TIME_TO_UPDATE || timeToUpdateDates;

        const data = {
            mode: MODE,
            timeToUpdateDates: TIME_TO_UPDATE_DATES
        }

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при чтении файла настроек: ${err}`});
    }
});

module.exports = router;