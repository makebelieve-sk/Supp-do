// Маршруты для раздела "Характеристики оборудования"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const EquipmentProperty = require("../schemes/EquipmentProperty");
const Log = require("../schemes/Log");
const {getUser} = require("./helper");

const router = Router();

// Валидация полей раздела "Характеристики оборудования"
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

    let {name, notes} = req.body;

    if (body) {
        name = body.name;
        notes = body.notes;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Перечень оборудования, Наименование: ${name}, Примечание: ${notes}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/equipmentProperties/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new EquipmentProperty({name: "", notes: ""});    // Создание нового экземпляра записи
        } else {
            item = await EquipmentProperty.findById({_id});          // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(404).json({message: `Характеристика с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, equipmentProperty: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}: ${err}`});
    }
});

// Возвращает все записи
router.get("/equipmentProperties", async (req, res) => {
    try {
        const items = await EquipmentProperty.find({}); // Получаем все записи раздела "Характеристики оборудования"

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/equipmentProperties", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, notes} = req.body;     // Получаем объект записи с фронтенда

        const item = await EquipmentProperty.findOne({name});   // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Характеристика с именем ${name} уже существует`});

        const newItem = new EquipmentProperty({name, notes});   // Создаем новый экземпляр записи

        const savedItem = await newItem.save(); // Сохраняем запись в базе данных

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        res.status(201).json({message: "Характеристика сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/equipmentProperties", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {_id, name, notes} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await EquipmentProperty.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Характеристика с именем ${name} (${_id}) не найдена`});

        // Ищем все подразделения
        const equipmentProperties = await EquipmentProperty.find({});

        if (equipmentProperties && equipmentProperties.length) {
            for (let i = 0; i < equipmentProperties.length; i++) {
                if (equipmentProperties[i].name === name && equipmentProperties[i]._id.toString() !== _id.toString()) {
                    return res.status(400).json({message: "Характеристика с таким именем уже существует"});
                }
            }
        }

        item.name = name;
        item.notes = notes;

        await item.save();  // Сохраняем запись в базу данных

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        res.status(201).json({message: "Характеристика сохранена", item: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/equipmentProperties/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        const item = await EquipmentProperty.findById({_id});  // Ищем текущую запись

        await logUserActions(req, res, "Удаление", item);   // Логируем действие пользвателя

        if (item) {
            await EquipmentProperty.deleteOne({_id});   // Удаление записи из базы данных по id записи
            return res.status(200).json({message: "Характеристика успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при удалении характеристики с кодом ${_id}: ${err}`});
    }
});

module.exports = router;