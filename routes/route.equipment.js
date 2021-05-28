// Маршруты для раздела "Перечень оборудования"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const Equipment = require("../schemes/Equipment");
const Log = require("../schemes/Log");
const File = require("../schemes/File");
const {getUser} = require("./helper");

const router = Router();

// Валидация полей раздела "Перечень оборудования"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

/**
 * Функция логирования действий пользователея
 * @param req - объект req запроса
 * @param res - объект res запроса
 * @param action - действие пользователя
 * @param body - удаляемая запись
 * @returns {Promise<*>} - возвращаем промис (сохранение записи в бд)
 */
const logUserActions = async (req, res, action, body = null) => {
    if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

    let {name, notes, parent} = req.body;

    if (body) {
        name = body.name;
        notes = body.notes;
        parent = body.parent;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Перечень оборудования, Наименование: ${name}, Примечание: ${notes}, Принадлежит: ${parent ? parent.name : ""}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/equipment/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        let equipment, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            equipment = new Equipment({
                name: "",
                notes: "",
                parent: null,
                properties: null,
                files: []
            });
        } else {
            // Получение существующей записи
            equipment = await Equipment.findById({_id})
                .populate("parent")
                .populate("properties.equipmentProperty")
                .populate("files");
            isNewItem = false;
        }

        if (!equipment) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, equipment});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при получении записи: ${err}`});
    }
});

// Возвращает все записи
router.get("/equipment", async (req, res) => {
    try {
        // Получаем все записи раздела "Перечень оборудования"
        const items = await Equipment.find({})
            .populate("parent")
            .populate("properties")
            .populate("files");

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/equipment", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Перечень оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        let resFileArr = [];    // Результирующий массив файлов

        const {name, notes, parent, properties, files} = req.body;  // Получаем объект записи с фронтенда

        // Ищем все записи с таким же именем
        const sameEquipments = await Equipment.find({name}).populate("parent");

        // Если запись с таким родителем и наименованием уже существует, возвращаем ошибку
        if (sameEquipments && sameEquipments.length) {
            try {
                sameEquipments.forEach(sameEquipment => {
                    if (sameEquipment.name === name) {
                        if (parent && sameEquipment.parent && sameEquipment.parent._id.toString() === parent._id.toString()
                            || !parent && !sameEquipment.parent) {
                            throw new Error("Такое оборудование уже существует");
                        }
                    }
                });
            } catch (e) {
                return res.status(400).json({message: e.message});
            }
        }

        // Проверяем на принадлежность самому себе
        if (parent && name === parent.name)
            return res.status(400).json({message: "Объект не может принадлежать сам себе"});

        // Заполнение массива файлов
        if (files && files.length >= 0) {
            for (const file of files) {
                const findFile = await File.findOne({originUid: file.originUid});

                findFile.uid = `${findFile._id}-${findFile.name}`;

                await findFile.save();

                resFileArr.push(findFile);
            }
        }

        // Создаем новый экземпляр записи
        const newItem = new Equipment({parent, name, notes, properties, files: resFileArr});

        let item = await newItem.save();   // Сохраняем запись в базе данных

        item = await Equipment.findById({_id: item._id})
            .populate("parent")
            .populate("properties.equipmentProperty")
            .populate("files");

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        res.status(201).json({message: "Оборудование сохранено", item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/equipment", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Перечень оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {_id, name, notes, parent, properties, files} = req.body; // Получаем объект записи с фронтенда

        // Ищем записи с таким же именем
        const sameEquipments = await Equipment.find({name}).populate("parent");

        // Если запись с таким родителем и наименованием уже существует, возвращаем ошибку
        if (sameEquipments && sameEquipments.length) {
            try {
                sameEquipments.forEach(sameEquipment => {
                    if (name === sameEquipment.name && sameEquipment._id.toString() !== _id.toString()) {
                        if (parent && sameEquipment.parent && parent._id.toString() === sameEquipment.parent._id.toString()
                            || !parent && !sameEquipment.parent) {
                            throw new Error("Такое оборудование уже существует");
                        }
                    }
                });
            } catch (e) {
                return res.status(400).json({message: e.message});
            }
        }

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Equipment.findById({_id});

        // Получаем все записи Перечня оборудования
        const equipment = await Equipment.find({}).populate("parent");

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Запись с именем ${name} (${_id}) не найдена`});

        // Проверяем на принадлежность самому себе
        if (parent && name === parent.name)
            return res.status(400).json({message: "Отдел не может принадлежать сам себе"});

        let resFileArr = [];    // Результирующий массив файлов

        // Заполняем массив файлов
        if (files && files.length >= 0) {
            for (const file of files) {
                if (file.uid.slice(0, 3) === "-1-") {
                    const findFile = await File.findOne({originUid: file.originUid});

                    findFile.uid = `${findFile._id}-${file.name}`

                    await findFile.save();

                    resFileArr.push(findFile);
                } else {
                    resFileArr.push(file);
                }
            }
        }

        item.name = name;
        item.notes = notes;
        item.parent = parent;
        item.properties = properties;
        item.files = resFileArr;

        // Проверяем на принадлежность отдела (циклические ссылки)
        if (parent) {
            const checkCycl = (parent) => {
                if (parent && parent.parent) {
                    if (parent.parent._id.toString() === _id.toString()) {
                        item.parent = null;

                        return res
                            .status(400)
                            .json({message: "Отдел не может принадлежать сам себе (циклическая ссылка)"});
                    } else {
                        const parentItem = equipment.find(eq => eq._id.toString() === parent.parent._id.toString());

                        // Вызов рекурсии с найденным родителем
                        checkCycl(parentItem ? parentItem : null);
                    }
                }
            }

            // Объект, установленный в качестве родителя
            const equipmentWithParent = equipment.find(eq => eq._id.toString() === parent._id.toString());

            // Вызов рекурсии с объектом, установленным в качестве родителя
            checkCycl(equipmentWithParent);
        }

        await item.save();  // Сохраняем запись в базу данных

        const savedItem = await Equipment.findById({_id})
            .populate("parent")
            .populate("properties.equipmentProperty")
            .populate("files");

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/equipment/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        const equipment = await Equipment.find({}).populate("parent");

        // Проверяем запись на дочернее оборудование
        if (equipment && equipment.length) {
            for (let i = 0; i < equipment.length; i++) {
                if (equipment[i].parent && equipment[i].parent._id.toString() === _id.toString()) {
                    return res
                        .status(400)
                        .json({message: "Невозможно удалить оборудование, т.к. у него есть дочернее оборудование"});
                }
            }
        }

        const item = await Equipment.findById({_id});  // Ищем текущую запись

        if (item) {
            await Equipment.deleteOne({_id});   // Удаление записи из базы данных по id записи

            await logUserActions(req, res, "Удаление", equipment);   // Логируем действие пользвателя

            return res.status(200).json({message: "Запись успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении записи: ${err}`});
    }
});

module.exports = router;