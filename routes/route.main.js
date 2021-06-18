// Маршрут для получения файла настроек приложения
const {Router} = require("express");
const fs = require("fs");
const IPInfo = require("node-ipinfo");

const router = Router();

// Возвращает содержимое файла настроек
router.get("/config", async (req, res) => {
    try {
        const config = fs.readFileSync("config/default.json", "utf8");

        if (!config) {
            return res.status(400).json({message: "Файл настроек проекта не существует или он пуст"});
        }

        const data = JSON.parse(config);

        // Получаем ip-адрес пользователя
        const userIpAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if (userIpAddress) {
            try {
                const token = config.ipKey;
                const ip = userIpAddress;
                const ipInfo = new IPInfo(token);

                ipInfo.lookupIp(ip).then((response) => {
                    console.log(response);
                });

                // ipInfo.lookupASN(asn).then((response) => {
                //     console.log(response.asn); // AS7922
                //     console.log(response.name); // Comcast Cable Communications, LLC
                //     console.log(response.country); // United States
                // });
            } catch (e) {
                console.log(e)
            }
        }

        // Удаляем секретные поля
        delete data.jwtSecret;
        delete data.mongoUri;
        delete data.ipKey;

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при чтении файла настроек: ${err}`});
    }
});

module.exports = router;