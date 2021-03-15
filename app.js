const express = require("express");
const config = require("./config/default.json");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json({extended: true}));

// Регистрируем маршруты
app.use('/api', require("./routes/route.logDO"));
app.use('/api/auth', require("./routes/route.auth"));
app.use('/api/directory', require("./routes/route.profession"));
app.use('/api/directory', require("./routes/route.department"));
app.use('/api/directory', require("./routes/route.person"));
app.use('/api/directory', require("./routes/route.taskStatus"));
app.use('/api/directory', require("./routes/route.equipmentProperty"));
app.use('/api/directory', require("./routes/route.equipment"));

app.use(fileUpload({createParentPath: true}));
app.use("/public", express.static('public'));
app.use('/files', require("./routes/route.upload"));

const PORT = process.env.PORT || config.port || 5000;

if (process.env.NODE_ENV === "production") {
    // При запуске на сервере необходимо регистрировать фронтенд
    app.use("/", express.static(path.join(__dirname, "../client/build")));

    // Любой get запрос будет отправляться в файл index.html (в билд)
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "../client/build/index.html"));
    })
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.options("*", cors());

async function start() {
    try {
        // Подключаемся к базе данных
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(PORT, () => console.log(`App has been started on port: ${PORT}`));
    } catch (e) {
        console.log("Server error: ", e);
        process.exit(1);
    }
}

start();