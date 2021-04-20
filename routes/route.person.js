// Маршруты для раздела "Персонал"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const Person = require("../schemes/Person");
const Department = require("../schemes/Department");
const PersonDto = require("../dto/PersonDto");
const router = Router();

// Валидация полей раздела "Персонал"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: 255 }),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({ max: 255 })
];

// Возвращает запись по коду
router.get("/people/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            // Создание новой записи
            item = new Person({tabNumber: null, name: "", notes: "", department: null, profession: null});
        } else {
            // Получение существующей записи
            item = await Person.findById({_id})
                .populate({
                    path: "department",
                    populate: {
                        path: "parent",
                        model: "Department"
                    }
                })
                .populate("profession");
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        res.status(201).json({isNewItem, person: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/people/", async (req, res) => {
    try {
        // Получаем все записи подразделений
        const departments = await Department.find({}).populate("parent");

        // Получаем все записи раздела "Персонал"
        const items = await Person.find({})
            .populate({
                path: "department",
                populate: {
                    path: "parent",
                    model: "Department"
                }
            })
            .populate("profession");

        let itemsDto = [];

        // Изменяем запись для вывода в таблицу
        if (items && items.length) itemsDto = items.map(item => new PersonDto(item, departments));

        res.json(itemsDto);
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Ошибка при получении записей о сотрудниках"})
    }
});

// Сохраняет новую запись
router.post("/people", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Персонал"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {name, notes, department, profession} = req.body; // Получаем объект записи с фронтенда

        const item = await Person.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Запись о сотруднике с именем ${name} уже существует`});

        const newItem = new Person({name, department, profession, notes});  // Создаем новый экземпляр записи

        await newItem.save();   // Сохраняем запись в базе данных

        // Получаем все записи подразделений
        const departments = await Department.find({}).populate("parent");

        // Ищем запись в базе данных по наименованию
        const currentPerson = await Person.findOne({name})
            .populate({
                path: "department",
                populate: {
                    path: "parent",
                    model: "Department"
                }
            })
            .populate("profession");

        // Изменяем запись для вывода в таблицу
        const savedItem = new PersonDto(currentPerson, departments);

        res.status(201).json({message: "Запись о сотруднике сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/people", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {_id, name, notes, department, profession} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Person.findById({_id}).populate("department").populate("profession");

        // Проверяем на существование записи с уникальным идентификатором
        if (!item)
            return res.status(400).json({message: `Запись о сотруднике с кодом ${_id} не найдена`});

        item.name = name;
        item.department = department;
        item.profession = profession;
        item.notes = notes;

        await item.save();  // Сохраняем запись в базу данных

        // Пролучаем все запиис подразделений
        const departments = await Department.find({}).populate("parent");

        // Ищем запись в базе данных по уникальному идентификатору
        const currentItem = await Person.findById({_id})
            .populate({
                path: "department",
                populate: {
                    path: "parent",
                    model: "Department"
                }
            })
            .populate("profession");

        // Изменяем запись для вывода в таблицу
        const savedItem = new PersonDto(currentItem, departments);

        res.status(201).json({message: "Запись о сотруднике успешно изменена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи о сотруднике"})
    }
});

// Удаляет запись
router.delete("/people/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        await Person.deleteOne({_id});  // Удаление записи из базы данных по id записи

        res.status(201).json({message: "Запись о сотруднике успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;