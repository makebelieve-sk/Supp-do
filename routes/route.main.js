// Маршрут для получения файла настроек приложения
const {Router} = require("express");
const fs = require("fs");

const router = Router();

// Возвращает содержимое файла настроек
router.get("/config", async (req, res) => {
    try {
        const config = fs.readFileSync("config/default.json", "utf8");

        return res.status(200).json(JSON.parse(config));
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при чтении файла настроек: ${err}`});
    }
});

module.exports = router;