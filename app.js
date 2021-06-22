// Главный файл сервера
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const moment = require("moment");
const http = require("http");

const config = require("./config/default.json");
const AuthMiddleware = require("./middlewares/auth.middleware");

const app = express();

const {jwtSecret, mongoUri, mode, timeToUpdateDates, port} = config;  // Разворачиваем объект настроек проекта

const corsOptions = {
    origin: "*",
    credentials: true
};

app.use(cors(corsOptions));

// Регистрируем мидлвары
app.use(express.json({extended: true}));
app.use(cookieParser(jwtSecret));

// Регистрируем маршруты
// Чтение файла настроек (получение режима работы приложения)
app.use("/main", require("./routes/route.main"));

// Авторизация
app.use("/api/auth", require("./routes/route.auth"));

// Обновление дат раздела "Журнал дефектов и отказов" в демо режиме
app.use("/api/logDO-update", require("./routes/route.logDO.update"));

// Для всех роутов, указанных ниже, используется мидлвар проверки авторизации и ролей пользователя
// Разделы приложения
app.use("/api/analytic", AuthMiddleware.checkAuth, require("./routes/route.analytic"));
app.use("/api/analytic", AuthMiddleware.checkAuth, require("./routes/route.statistic"));
app.use("/api/directory", AuthMiddleware.checkAuth, require("./routes/route.profession"));
app.use("/api/directory", AuthMiddleware.checkAuth, require("./routes/route.department"));
app.use("/api/directory", AuthMiddleware.checkAuth, require("./routes/route.person"));
app.use("/api/directory", AuthMiddleware.checkAuth, require("./routes/route.taskStatus"));
app.use("/api/directory", AuthMiddleware.checkAuth, require("./routes/route.equipmentProperty"));
app.use("/api/directory", AuthMiddleware.checkAuth, require("./routes/route.equipment"));
app.use("/api", AuthMiddleware.checkAuth, require("./routes/route.logDO"));
app.use("/api/admin", AuthMiddleware.checkAuth, require("./routes/route.help"));
app.use("/api/admin", AuthMiddleware.checkAuth, require("./routes/route.user"));
app.use("/api/admin", AuthMiddleware.checkAuth, require("./routes/route.role"));
app.use("/api/admin", AuthMiddleware.checkAuth, require("./routes/route.log"));
app.use("/api/profile", AuthMiddleware.checkAuth, require("./routes/route.profile"));

// Работа с файлами
app.use(fileUpload({createParentPath: true}));
app.use("/public", express.static("public"));
app.use("/files", AuthMiddleware.checkAuth, require("./routes/route.upload"));

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    });
}

async function start() {
    try {
        // Подключаемся к базе данных
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        const PORT = process.env.PORT || port || 7000;

        // Обновление дат записей в 00:05 в демо-режиме
        if (mode && mode === "demo") {
            const hours = +timeToUpdateDates.split(":")[0];
            const minutes = +timeToUpdateDates.split(":")[1];
            const seconds = +timeToUpdateDates.split(":")[2];

            setInterval(() => {
                if (moment().hours() === hours && moment().minutes() === minutes && moment().seconds() === seconds) {
                    http.get(`http://localhost:${PORT}/api/logDO-update`, function(response) {
                        response.pipe(process.stdout);
                    });
                }
            }, 1000);
        }

        app.listen(PORT, () => console.log(`Приложение запущено на порту ${PORT} в режиме ${process.env.NODE_ENV}`));
    } catch (e) {
        console.log("Ошибка сервера: ", e);
        process.exit(1);
    }
}

start().then(null);