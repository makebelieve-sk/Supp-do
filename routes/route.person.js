// Маршруты для раздела "Персонал"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const Person = require("../schemes/Person");
const Log = require("../schemes/Log");
const Department = require("../schemes/Department");
const PersonDto = require("../dto/PersonDto");
const {getUser} = require("./helper");

const router = Router();

// Валидация полей раздела "Персонал"
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

    let {name, notes, department, profession} = req.body;

    if (body) {
        name = body.name;
        notes = body.notes;
        department = body.department;
        profession = body.profession;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Персонал, Наименование: ${name}, Примечание: ${notes}, Подразделение: ${department ? department.name : ""}, Профессия: ${profession ? profession.name : ""}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/people/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

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

        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, person: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи: ${err}`});
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

        res.status(200).json(itemsDto);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/people", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Персонал"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, notes, department, profession} = req.body; // Получаем объект записи с фронтенда

        const item = await Person.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(404).json({message: `Запись о сотруднике с именем ${name} уже существует`});

        const newItem = new Person({name, department, profession, notes});  // Создаем новый экземпляр записи

        const savedPerson = await newItem.save();   // Сохраняем запись в базе данных

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        // Получаем все записи подразделений
        const departments = await Department.find({}).populate("parent");

        // Ищем только что сохраненную запись в базе данных
        const currentPerson = await Person.findById({_id: savedPerson._id})
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

        res.status(201).json({message: "Запись сохранена", item: savedItem, currentItem: currentPerson});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/people", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {_id, name, notes, department, profession} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Person.findById({_id}).populate("department").populate("profession");

        // Проверяем на существование записи с уникальным идентификатором
        if (!item)
            return res.status(404).json({message: `Запись с именем ${name} (${_id}) не найдена`});

        // Ищем все записи персонала
        const people = await Person.find({});

        if (people && people.length) {
            try {
                people.forEach(person => {
                    if (person.name === name && person._id.toString() !== _id.toString()) {
                        throw new Error("Запись с таким именем уже существует");
                    }
                })
            } catch (e) {
                return res.status(400).json({message: e.message});
            }
        }

        item.name = name;
        item.department = department;
        item.profession = profession;
        item.notes = notes;

        await item.save();  // Сохраняем запись в базу данных

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        // Получаем все записи подразделений
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

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/people/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        const item = await Person.findById({_id}).populate("department").populate("profession")  // Ищем текущую запись

        if (item) {
            await Person.deleteOne({_id});  // Удаление записи из базы данных по id записи
            await logUserActions(req, res, "Удаление", item);   // Логируем действие пользвателя
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