// Маршрут для получения файла настроек приложения
const {Router} = require("express");
const fs = require("fs");

const router = Router();

// Возвращает содержимое файла настроек
router.get("/config", async (req, res) => {
    try {
        const config = fs.readFileSync("config/default.json", "utf8");

        if (!config) {
            return res.status(400).json({message: "Файл настроек проекта не существует или он пуст"});
        }

        const data = JSON.parse(config);

        // Удаляем секретные поля
        delete data.jwtSecret;
        delete data.mongoUri;

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при чтении файла настроек: ${err}`});
    }
});

module.exports = router;