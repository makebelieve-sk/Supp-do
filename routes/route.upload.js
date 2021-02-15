// Маршруты для загрузки файлов
const {Router} = require("express");
const Equipment = require("../models/Equipment");
const router = Router();

router.post("/upload", async (req, res) => {
    console.log(req.files);
});
