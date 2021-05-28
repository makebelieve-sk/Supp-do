// Маршруты для загрузки файлов
const {Router} = require("express");
const fs = require("fs");

const LogDO = require("../schemes/LogDO");
const Equipment = require("../schemes/Equipment");
const File = require("../schemes/File");

const router = Router();

// Функция определения текущей модели
const checkModel = (model) => model === "equipment" ? Equipment : LogDO;

// Сохраняет файл
router.post("/upload", async (req, res) => {
    const originalFileName = req.files.file.name;   // Получаем имя файла

    try {
        const files = await File.find({});  // Получаем все файлы

        const {id, originUid, model, uid} = req.body;   // Принимаем объект с фронтенда

        const Model = checkModel(model);    // Определяем модель

        // Если два одинаковых файла добавляются в запись
        for (let file of files) {
            if (file.uid.slice(0, 3) === "-1-" && file.name === originalFileName)
                return res.status(400).json({message: "Такой файл уже существует в этой записи."});
        }

        // Существующий файл добавляется в уже существующую запись
        if (id !== "-1") {
            const item = await Model.findOne({_id: id}).populate("files");
            for (let file of item.files) {
                if (file.name === originalFileName)
                    return res.status(400).json({message: "Такой файл уже существует в этой записи."});
            }
        }

        // Создаем новый экземпляр файла
        const file = new File({
            name: originalFileName,
            url: `public/${model}/${uid}-${originalFileName}`,
            status: "done",
            uid: `-1-${originalFileName}`,
            originUid: originUid
        });

        await file.save();  // Сохраняем запись в базу данных

        await req.files.file.mv(file.url);  // Сохраняем файл на диске

        return res.end(req.files.file.name);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при загрузке файла ${originalFileName}: ${err}`});
    }
});

// Удаляет файлы записи при клике на кнопку "Удалить"
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;   // Получение id файла

        let item = null;

        const {model} = req.body;   // Получаем объект с фронтенда

        const Model = checkModel(model);  // Определяем модель

        // Находим запись по уникальному идентификатору
        item = await Model.findById({_id: id}).populate("files");

        // Удялаем выбранный файл
        for (const file of item.files) {
            await File.deleteOne({_id: file._id});  // из базы данных

            // с диска
            await fs.unlink(file.url, (err) => {
                if (err) console.log(err);
            });
        }

        const notSavedFiles = await File.find({});  // Находим все несохраненные файлы

        // Удаляем несохраненные файлы с диска и из базы данных
        for (const file of notSavedFiles) {
            if (file.uid.slice(0, 3) === "-1-") {
                await File.deleteOne({_id: file._id});

                await fs.unlink(file.url, (err) => {
                    if (err) console.log(err)
                });
            }
        }

        return res.status(200).json({message: "Файлы успешно удалены"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при удалении файлов записи: ${err}`});
    }
});

// Удаляет файл при клике на него
router.delete("/delete-file/:id", async (req, res) => {
    try {
        const id = req.params.id;   // Получение id файла

        let item = null;

        const {_id, uid, url, model} = req.body;    // Получаем объект с фронтенда

        const Model = checkModel(model);    // Определяем модель

        if (id === "-1") {
            // Удаляем все сохраненные и добавленные файлы
            const file = await File.findOne({uid});

            await File.deleteOne({_id: file._id});

            await fs.unlink(file.url, (err) => {
                if (err) console.log(err)
            });
        } else {
            // Удаляем все несохраненные, но добавленные файлы
            if (uid.slice(0, 3) === "-1-") {
                const file = await File.findOne({uid});

                await File.deleteOne({_id: file._id});

                await fs.unlink(file.url, (err) => {
                    if (err) console.log(err)
                });
            } else {
                item = await Model.findById({_id: id}).populate("files");

                let foundFile = item.files.find(file => file.uid === uid);
                let indexOf = item.files.indexOf(foundFile);
                item.files.splice(indexOf, 1);

                await item.save();

                await File.deleteOne({_id: _id});

                await fs.unlink(url, (err) => {
                    if (err) console.log(err)
                });
            }
        }

        return res.status(200).json({message: "Файл успешно удалён"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при удалении файла: ${err}`});
    }
});

// Удаляет файл при клике на кнопку "Отмена" при редактировании или создании записи
router.delete("/cancel", async (req, res) => {
    try {
        const files = await File.find({});  // Находим все файлы

        // Удаляем все несохраненные, но добавленные файлы
        for (const file of files) {
            if (file.uid.slice(0, 3) === "-1-") {
                await File.deleteOne({uid: file.uid});

                await fs.unlink(file.url, (err) => {
                    if (err) console.log(err)
                });
            }
        }

        return res.status(200).json({message: "Файл успешно удалён"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Ошибка при закрытии записи, пожалуйста, удалите добавленные, но не сохраненные файлы" + err});
    }
});

module.exports = router;