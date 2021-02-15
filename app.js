const express = require("express");
const config = require("./config/default.json");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const Equipment = require("./models/Equipment");
const File = require("./models/File")

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
app.use(fileUpload({
    createParentPath: true
}));
app.use("/static", express.static('public'));

app.post("/upload", async (req, res) => {
    const originalFileName = req.files.file.name;

    const _id = req.body.equipmentId;

    const item = await Equipment.findById({_id}).populate("files");

    if (item) {
        let file = new File({name: originalFileName, url: 'public/'+originalFileName});
        file = await file.save();
        item.files.push(file);
        await item.save();
    }

    try {
        const saved = await req.files.file.mv("public/" + originalFileName);

        res.end(req.files.file.name);
    } catch (e) {
        res.status(500).json({message: `Ошибка при загрузке файла ${originalFileName}`})
    }
});

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