// Маршруты для раздела "Помощь"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const Help = require("../schemes/Help");
const Log = require("../schemes/Log");
const HelpDto = require("../dto/HelpDto");
const {getUser} = require("./helper");

const router = Router();

// Валидация полей раздела "Помощь"
const checkMiddleware = [check("name", "Поле 'Название раздела' должно быть заполнено").notEmpty()];

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

    let {name, text} = req.body;

    if (body) {
        name = body.name;
        text = body.text;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Помощь, Наименование: ${name}, Примечание: ${text}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/help/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        let item, isNewItem = true;

        if (_id === "-1") {
            item = new Help({name: null, text: "", date: null});    // Создание новой записи
        } else {
            item = await Help.findById({_id});  // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        res.status(200).json({isNewItem, help: item});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: `Ошибка при открытии записи: ${err}`});
    }
});

// Возвращает запись при клике на кнопку "Помощь"
router.get("/help/get/:id", async (req, res) => {
    try {
        const value = req.params.id;   // поле value объекта name

        const item = await Help.findOne({"name.value": value}); // Находим нужную запись

        const response = item ? {title: item.name.label, text: item.text} : null;   // Составляем объект ответа

        res.status(200).json(response); // Отправляем ответ
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записи: " + err});
    }
});

// Возвращает все записи
router.get("/help", async (req, res) => {
    try {
        const items = await Help.find({});  // Получаем все записи раздела "Помощь"

        let itemsDto = [];

        // Изменяем запись для вывода в таблицу
        if (items && items.length) itemsDto = items.map(item => new HelpDto(item));

        res.status(200).json(itemsDto);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/help", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Помощь"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, text} = req.body;  // Получаем объект записи с фронтенда

        let item = await Help.findOne({name});  // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item)
            return res.status(400).json({message: `Запись с наименованием ${name} уже существует`});

        item = new Help({name, text, date: Date.now()});    // Создаем новый экземпляр записи

        const currentHelp = await item.save();  // Сохраняем запись в базе данных

        // Изменяем запись для вывода в таблицу
        const savedItem = new HelpDto(currentHelp);

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/help", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при изменении записи"
            });

        const {_id, name, text} = req.body; // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Help.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Запись с именем ${name} (${_id}) не найдена`});

        // Ищем все записи помощи
        const helps = await Help.find({});

        if (helps && helps.length) {
            try {
                helps.forEach(help => {
                    if (help.name === name && help._id.toString() !== _id.toString()) {
                        throw new Error("Запись с таким именем уже существует");
                    }
                });
            } catch (err) {
                return res.status(400).json({message: err.message});
            }
        }

        item.name = name;
        item.text = text;
        item.date = Date.now();

        const currentHelp = await item.save();  // Сохраняем запись в базу данных

        // Изменяем запись для вывода в таблицу
        const savedItem = new HelpDto(currentHelp);

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/help/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        const item = await Help.findById({_id});  // Ищем текущую запись

        if (item) {
            await Help.deleteOne({_id});    // Удаление записи из базы данных по id записи
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