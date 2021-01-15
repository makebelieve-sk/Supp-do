const express = require("express");
const config = require("./config/default.json");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({extended: true}));

app.use('/api/directory', require("./routes/route.directory"));

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