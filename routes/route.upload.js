// Маршруты для загрузки файлов
const {Router} = require("express");
const router = Router();
const Equipment = require("../models/Equipment");
const File = require("../models/File");
const fs = require('fs');

// Сохраняет/изменяет файл
router.post("/upload", async (req, res) => {
    const originalFileName = req.files.file.name;

    try {
        let file = new File({
            name: originalFileName,
            url: `public/${originalFileName}`,
            status: "done",
            uid: `-1-${originalFileName}`
        });

        await file.save();

        await req.files.file.mv(`public/${originalFileName}`);

        res.end(req.files.file.name);
    } catch (e) {
        res.status(500).json({message: `Ошибка при загрузке файла ${originalFileName}`})
    }
});

// Удаляет файлы записи при клике на кнопку "Удалить"
router.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    let item = null;

    try {
        item = await Equipment.findById({_id: id}).populate("files");

        for (const file of item.files) {
            await File.deleteOne({_id: file._id});

            await fs.unlink(file.url, (err) => {
                if (err) console.log(err)
            });
        }

        let notSavedFiles = await File.find({});

        for (const file of notSavedFiles) {
            if (file.uid.slice(0, 3) === "-1-") {
                await File.deleteOne({_id: file._id});

                await fs.unlink(file.url, (err) => {
                    if (err) console.log(err)
                });
            }
        }

        res.status(201).json({message: "Файлы успешно удалены"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${id}`});
    }
});

// Удаляет файл при клике на него
router.delete("/delete-file/:id", async (req, res) => {
    const id = req.params.id;
    let item = null;

    try {
        const {_id, uid, url, name} = req.body;

        if (id === "-1") {
            await File.deleteOne({name: name});
        } else {
            if (uid.slice(0, 3) === "-1-") {
                await File.deleteOne({name: name});
            } else {
                item = await Equipment.findById({_id: id}).populate("files");

                let foundFile = item.files.find(file => file.uid === uid);
                let indexOf = item.files.indexOf(foundFile);
                item.files.splice(indexOf, 1);

                await item.save();

                await File.deleteOne({_id: _id});
            }
        }

        await fs.unlink(url, (err) => {
            if (err) console.log(err)
        });

        res.status(201).json({message: "Файл успешно удалён"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении файла с кодом ${id}`});
    }
});

// Удаляет файл при клике на кнопку "Отмена" при редактировании или создании записи
router.delete("/cancel", async (req, res) => {
    try {
        const files = await File.find({}).populate("files");

        for (const file of files) {
            if (file.uid.slice(0, 3) === "-1-") {
                await File.deleteOne({uid: file.uid});

                await fs.unlink(file.url, (err) => {
                    if (err) console.log(err)
                });
            }
        }

        res.status(201).json({message: "Файл успешно удалён"});
    } catch (e) {
        res.status(500).json({
            message: `Ошибка при закрытии записи, пожалуйста, удалите добавленные, но не сохраненные записи.`
        });
    }
});

module.exports = router;