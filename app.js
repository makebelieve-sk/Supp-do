const express = require("express");
const config = require("./config/default.json");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({extended: true}));

// Регистрируем маршруты
app.use('/api/auth', require("./routes/route.auth"));
app.use('/api/directory', require("./routes/route.profession"));
app.use('/api/directory', require("./routes/route.department"));
app.use('/api/directory', require("./routes/route.person"));
app.use('/api/directory', require("./routes/route.taskStatus"));
app.use('/api/directory', require("./routes/route.equipmentProperty"));
app.use('/api/directory', require("./routes/route.equipment"));

const PORT = config.port || 5000;

async function start() {
    try {
        // Подключаемся к базе данных
        await mongoose.connect(config.mongoUri, {
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