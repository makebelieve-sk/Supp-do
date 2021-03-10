// Маршруты для "Перечень оборудования"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Equipment = require("../models/Equipment");
const EquipmentProperty = require("../models/EquipmentProperty");
const File = require("../models/File");
const router = Router();

// Валидация полей раздела "Оборудование"
const checkMiddleware = [
    check("name", "Некорректное наименование оборудования").isString().notEmpty().isLength({ max: 255 }),
    check("notes", "Максимальная длина поля 'Примечание' составляет 255 символов").isString().isLength({ max: 255 })
];

// Возвращает запись по коду
router.get("/equipment/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item;

        if (_id === "-1") {
            // Создание новой записи
            item = new Equipment({
                isCreated: true,
                name: "",
                notes: "",
                parent: null,
                properties: [{
                    equipmentProperty: "Не выбрано",
                    value: "",
                    id: Date.now(),
                    name: 0,
                    _id: null
                }],
                files: []
            });
        } else {
            // Редактирование существующей записи
            item = await Equipment.findById({_id})
                .populate("parent")
                .populate("properties.equipmentProperty")
                .populate("files");
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});
        }

        res.status(201).json({equipment: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/equipment", async (req, res) => {
    try {
        const items = await Equipment.find({})
            .populate("parent")
            .populate("properties")
            .populate("files");

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении данных"})
    }
});

// Сохраняет новую запись
router.post("/equipment", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        let resFileArr = [];
        const {name, notes, parent, properties, files} = req.body;

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Объект не может принадлежать сам себе"});
            }
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (files && files.length >= 0) {
            for (const file of files) {
                const findFile = await File.findOne({originUid: file.originUid});

                findFile.uid = `${findFile._id}-${findFile.name}`;

                await findFile.save();

                resFileArr.push(findFile);
            }
        }

        const equipmentProperties = await EquipmentProperty.find({});

        properties.forEach(select => {
            let foundEquipmentProperty = equipmentProperties.find(property => {
                return property._id === select.equipmentProperty || property.name === select.equipmentProperty;
            });

            if (foundEquipmentProperty) {
                select.equipmentProperty = foundEquipmentProperty;
            }
        });

        const newItem = new Equipment({isCreated: false, parent, name, notes, properties, files: resFileArr});

        await newItem.save();

        let currentEquipment = await Equipment.findOne({name})
            .populate("parent")
            .populate("properties.equipmentProperty")
            .populate("files");

        res.status(201).json({message: "Подразделение сохранено", item: currentEquipment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/equipment", checkMiddleware, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});
        }

        const {_id, isCreated,  name, notes, parent, properties, files} = req.body;
        const item = await Equipment.findById({_id});
        let resFileArr = [];

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Объект не может принадлежать сам себе"});
            }
        }

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

        const equipmentProperties = await EquipmentProperty.find({});

        properties.forEach(select => {
            let foundEquipmentProperty = equipmentProperties.find(property => {
                return property._id === select.equipmentProperty || property.name === select.equipmentProperty;
            });

            if (foundEquipmentProperty) {
                select.equipmentProperty = foundEquipmentProperty;
            }
        });

        item.isCreated = isCreated;
        item.parent = parent;
        item.name = name;
        item.notes = notes;
        item.properties = properties;
        item.files = resFileArr;

        await item.save();

        let savedItem = await Equipment.findById({_id})
            .populate("parent")
            .populate("properties.equipmentProperty")
            .populate("files");

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete('/equipment/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        await Equipment.deleteOne({_id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;