const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");
const config = require("./config/default.json");

const app = express();

app.use(express.json({extended: true}));

// Регистрируем маршруты
app.use("/api", require("./routes/route.logDO"));
app.use("/api/auth", require("./routes/route.auth"));
app.use("/api/analytic", require("./routes/route.analytic"));
app.use("/api/directory", require("./routes/route.profession"));
app.use("/api/directory", require("./routes/route.department"));
app.use("/api/directory", require("./routes/route.person"));
app.use("/api/directory", require("./routes/route.taskStatus"));
app.use("/api/directory", require("./routes/route.equipmentProperty"));
app.use("/api/directory", require("./routes/route.equipment"));
app.use("/api/admin", require("./routes/route.help"));
app.use("/api/admin", require("./routes/route.user"));
app.use("/api/admin", require("./routes/route.role"));

app.use(fileUpload({createParentPath: true}));
app.use("/public", express.static("public"));
app.use("/files", require("./routes/route.upload"));

const PORT = config.port || 5000;

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

async function start() {
    try {
        // Подключаемся к базе данных
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        app.listen(PORT, () => console.log(`App has been started on port: ${PORT} with ENV ${process.env.NODE_ENV}`));
    } catch (e) {
        console.log("Server error: ", e);
        process.exit(1);
    }
}

start();